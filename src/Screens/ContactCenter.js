import React, { useContext, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../Components/Header";
import { COLORS } from "../Constant";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SubmitButton from "../Components/SubmitButton";
import { Validation } from "../hooks/InputValidation";
import Icons from "react-native-vector-icons/Ionicons";
import LoadingOverlay from "../Components/LoadingOverlay";
import { contactUs } from "../http";
import { showMessage } from "react-native-flash-message";
import { AuthContext } from "../context/AuthProvider";

const ContactCenter = (props) => {
  const emailRef = useRef();
  const { userDetail } = useContext(AuthContext);
  const descriptionRef = useRef();
  const [contactData, setContactData] = useState({
    nameValue: userDetail?.name + " " + userDetail?.surname,
    emailValue: userDetail?.email,
    descriptionValue: null,
  });
  const [contactError, setContactError] = useState({
    nameError: null,
    emailError: null,
    descriptionError: null,
  });

  const onSubmitHandler = async () => {
    LoadingOverlay.show("Loading...");
    setContactError({
      nameError: null,
      emailError: null,
      descriptionError: null,
    });

    const errorData = Validation(contactData);
    if (errorData?.name || errorData?.email || errorData?.description) {
      LoadingOverlay.hide();
      setContactError({
        nameError: errorData?.name,
        emailError: errorData?.email,
        descriptionError: errorData?.description,
      });
    } else {
      const params = {
        name: contactData?.nameValue,
        email: contactData?.emailValue,
        description: contactData?.descriptionValue,
      };
      try {
        const { data } = await contactUs(params);
        if (data?.success) {
          LoadingOverlay.show("Loading...");
          showMessage({
            message: "Successfully",
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
        console.log("Error in Contact Center ----->", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backPress={() => props?.navigation?.goBack()} />
      <ScrollView
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>Contact Us</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={[styles.fullNameText, { opacity: 0.7 }]}>Full Name</Text>
          <TextInput
            onSubmitEditing={() => emailRef.current.focus()}
            value={contactData?.nameValue}
            style={[styles.inputContainer, { opacity: 0.7 }]}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) =>
              setContactData({
                ...contactData,
                nameValue: v,
              })
            }
            editable={false}
          />
        </View>
        {contactError?.nameError && (
          <View style={styles.errorContainer}>
            <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
            <Text style={styles.errorText}> {contactError?.nameError}</Text>
          </View>
        )}

        <View style={styles.inputsOtherContainer}>
          <Text style={[styles.fullNameText, { opacity: 0.7 }]}>Email</Text>
          <TextInput
            ref={emailRef}
            onSubmitEditing={() => descriptionRef.current.focus()}
            value={contactData?.emailValue}
            style={[styles.inputContainer, { opacity: 0.7 }]}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) =>
              setContactData({
                ...contactData,
                emailValue: v,
              })
            }
            editable={false}
          />
        </View>
        {contactError?.emailError && (
          <View style={styles.errorContainer}>
            <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
            <Text style={styles.errorText}> {contactError?.emailError}</Text>
          </View>
        )}

        <View style={styles.inputsOtherContainer}>
          <Text style={styles.fullNameText}>Description</Text>
          <TextInput
            ref={descriptionRef}
            numberOfLines={6}
            multiline={true}
            value={contactData?.descriptionValue}
            style={styles.inputContainer}
            placeholder="Enter the description"
            placeholderTextColor={COLORS.darkGray}
            onChangeText={(v) =>
              setContactData({
                ...contactData,
                descriptionValue: v,
              })
            }
          />
        </View>
        {contactError?.descriptionError && (
          <View style={styles.errorContainer}>
            <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
            <Text style={styles.errorText}>
              {" "}
              {contactError?.descriptionError}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <SubmitButton
            title="Submit"
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
            onPress={onSubmitHandler}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: hp(5),
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

export default ContactCenter;
