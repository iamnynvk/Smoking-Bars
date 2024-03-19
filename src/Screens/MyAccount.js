import React, { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../Components/Header";
import { COLORS, images } from "../Constant";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SubmitButton from "../Components/SubmitButton";
import Icons from "react-native-vector-icons/Ionicons";
import { Validation } from "../hooks/InputValidation";
import LoadingOverlay from "../Components/LoadingOverlay";
import { profileUpdate } from "../http";
import { showMessage } from "react-native-flash-message";
import { ImagePickerModal } from "../Components/ImagePickerModal";
import ImagePicker from "react-native-image-crop-picker";
import { AuthContext } from "../context/AuthProvider";

const MyAccount = (props) => {
  const surnameRef = useRef();
  const { userDetail, setUserDetail } = useContext(AuthContext);
  const [emailData, setEmailData] = useState(userDetail?.email);
  const [userImage, setUserImage] = useState(userDetail?.profile_image);
  const [imageBase, setImageBase] = useState(null);
  const [visible, setVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    nameValue: userDetail?.name,
    surnameValue: userDetail?.surname,
  });
  const [userDetailError, setDetailError] = useState({
    nameError: null,
    surnameError: null,
  });

  const onImageLibraryPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      setImageBase(image?.data);

      const imageUri =
        Platform.OS === "ios"
          ? image.sourceURL.replace("file://", "")
          : image.path;
      setUserImage(imageUri);
      setVisible(false);
    });
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      setImageBase(image?.data);
      const imageUri =
        Platform.OS === "ios"
          ? image.sourceURL.replace("file://", "")
          : image.path;
      setUserImage(imageUri);
      setVisible(false);
    });
  };

  // Base64 convert on Link code
  // const getBase64FromUrl = async (url) => {
  //   const data = await fetch(url);
  //   const blob = await data.blob();
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = () => {
  //       const base64data = reader.result;
  //       resolve(base64data);
  //     };
  //   });
  // };

  // imageBase === null &&
  //   getBase64FromUrl(userDetail?.profile_image).then((data) => {
  //     setImageBase(data.split("base64,")[1]);
  //   });

  const UpdateProfileHandler = async () => {
    LoadingOverlay.show("Loading...");
    setDetailError({
      nameError: null,
      surnameError: null,
    });

    const errorData = Validation(userDetails);
    if (errorData?.name || errorData?.surname) {
      LoadingOverlay.hide();
      setDetailError({
        nameError: errorData?.name,
        surnameError: errorData?.surname,
      });
    } else {
      const params = imageBase
        ? {
            name: userDetails?.nameValue,
            surname: userDetails?.surnameValue,
            profile_image: imageBase,
          }
        : {
            name: userDetails?.nameValue,
            surname: userDetails?.surnameValue,
          };
      try {
        const { data } = await profileUpdate(params);
        if (data?.success) {
          setUserDetail(data?.data);
          LoadingOverlay.show("Loading...");
          showMessage({
            message: "Successfully Update Profile",
            description: data?.message,
            type: "default",
            backgroundColor: COLORS.success,
            color: COLORS.white,
            icon: (props) => (
              <Icons
                name="checkmark-circle-sharp"
                size={hp(2)}
                color={COLORS.white}
                {...props}
              />
            ),
          });
          LoadingOverlay.hide();
          props?.navigation?.navigate("Profile");
        } else {
          LoadingOverlay.hide();
          showMessage({
            message: "Warning!",
            description: data?.message,
            type: "default",
            backgroundColor: COLORS.danger,
            color: COLORS.white,
            icon: (props) => (
              <Icons
                name="warning-outline"
                size={hp(2)}
                color={COLORS.white}
                {...props}
              />
            ),
          });
        }
      } catch (error) {
        LoadingOverlay.hide();
        console.log("Error in My Account ----->", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backPress={() => props?.navigation?.goBack()} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>Basic Information</Text>
        </View>

        <View style={styles.chooseImageContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(true)}
          >
            <Image
              source={{ uri: userImage }}
              onError={(error) =>
                setUserImage(
                  "https://smoking-bar.lrdevteam.com/storage/profile-image/3/16734338131884981805.png"
                )
              }
              onLoad={() => {
                return (
                  <ActivityIndicator size={"small"} color={COLORS.white} />
                );
              }}
              style={[
                styles.imageStyles,
                { borderWidth: 1, borderColor: "#fff" },
              ]}
              resizeMode={"contain"}
            />
            <Icons
              name="add-circle-sharp"
              size={hp(4)}
              color={COLORS.white}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                bottom: -5,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.fullNameText}>Name</Text>
          <TextInput
            onSubmitEditing={() => surnameRef.current.focus()}
            value={userDetails?.nameValue}
            style={styles.inputContainer}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) =>
              setUserDetails({
                ...userDetails,
                nameValue: v,
              })
            }
          />
        </View>
        {userDetailError?.nameError && (
          <View style={styles.errorContainer}>
            <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
            <Text style={styles.errorText}> {userDetailError?.nameError}</Text>
          </View>
        )}

        <View style={styles.inputsOtherContainer}>
          <Text style={styles.fullNameText}>Surname</Text>
          <TextInput
            ref={surnameRef}
            value={userDetails?.surnameValue}
            style={styles.inputContainer}
            placeholder="Enter your Surname"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) =>
              setUserDetails({
                ...userDetails,
                surnameValue: v,
              })
            }
          />
        </View>
        {userDetailError?.surnameError && (
          <View style={styles.errorContainer}>
            <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
            <Text style={styles.errorText}>
              {" "}
              {userDetailError?.surnameError}
            </Text>
          </View>
        )}

        <View style={styles.inputsOtherContainer}>
          <Text style={[styles.fullNameText, { opacity: 0.7 }]}>Mail</Text>
          <TextInput
            value={emailData}
            style={[styles.inputContainer, { opacity: 0.7 }]}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) => setEmailData(v)}
            editable={false}
          />
        </View>

        <View style={styles.buttonContainer}>
          <SubmitButton
            title="Update Profile"
            textStyles={{
              fontFamily: "OpenSans-Bold",
              color: COLORS.white,
              fontWeight: "bold",
              fontSize: hp(2.5),
            }}
            gradientColor={[
              COLORS.btnGradientOne,
              COLORS.btnGradientTwo,
              COLORS.btnGradientThree,
            ]}
            onPress={UpdateProfileHandler}
          />
        </View>
      </ScrollView>
      <ImagePickerModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        onImageLibraryPress={onImageLibraryPress}
        onCameraPress={onCameraPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chooseImageContainer: {
    marginTop: hp(5),
    alignItems: "center",
  },
  imageStyles: {
    height: hp(12),
    width: hp(12),
    borderRadius: hp(6),
  },
  contactContainer: {
    marginStart: hp(2),
    marginTop: hp(2),
  },
  contactText: {
    color: COLORS.headingTextColor,
    fontFamily: "OpenSans-Bold",
    fontSize: hp(3),
  },
  nameContainer: {
    marginTop: hp(2),
    marginHorizontal: hp(2),
  },
  fullNameText: {
    color: COLORS.white,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2.3),
  },
  inputContainer: {
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.searchIconColor,
    padding: hp(1),
    borderRadius: hp(1),
    marginTop: hp(1),
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2),
  },
  inputsOtherContainer: {
    marginHorizontal: hp(2),
    marginTop: hp(3),
  },
  buttonContainer: {
    marginTop: hp(10),
    marginBottom: hp(2),
  },
  errorContainer: {
    flexDirection: "row",
    marginTop: hp(1),
    marginHorizontal: hp(2),
  },
  errorText: {
    fontFamily: "OpenSans-Medium",
    fontSize: hp(1.8),
    color: COLORS.white,
  },
});

export default MyAccount;
