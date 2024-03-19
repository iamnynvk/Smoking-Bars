import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Header from "../../Components/Header";
import SubmitButton from "../../Components/SubmitButton";
import TextInputName from "../../Components/TextInputName";
import { COLORS, images } from "../../Constant";
import { Validation } from "../../hooks/InputValidation";
import Icons from "react-native-vector-icons/Ionicons";

const SignupStepOne = (props) => {
  const surnameRef = useRef();
  const [signUpInput, setSignUpInput] = useState({
    nameValue: null,
    surnameValue: null,
  });
  const [signUpError, setSignUpError] = useState({
    nameError: null,
    surnameError: null,
  });

  const handleInputs = (value, field) => {
    setSignUpInput((prev) => {
      prev[field] = value;
      return prev;
    });
  };

  const signUpHandler = useCallback(() => {
    setSignUpError({
      nameError: null,
      surnameError: null,
    });

    const errorData = Validation(signUpInput);
    if (errorData?.name || errorData?.surname) {
      setSignUpError({
        nameError: errorData?.name,
        surnameError: errorData?.surname,
      });
    } else {
      props?.navigation?.navigate("SignupStepTwo", {
        UserInfo: signUpInput,
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header component */}
      <Header backPress={() => props?.navigation?.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginContainer}
      >
        <Text style={styles.signUpText}>Sign up</Text>

        {/* Email & Password textInput */}
        <View style={styles.formContainer}>
          <TextInputName
            title="Name"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "nameValue")}
            keyType="default"
            nextFocus={surnameRef}
            firstInput={true}
          />
          {signUpError?.nameError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {signUpError?.nameError}</Text>
            </View>
          )}
          <TextInputName
            refs={surnameRef}
            title="Surname"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "surnameValue")}
            keyType="default"
            firstInput={false}
          />
          {signUpError?.surnameError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {signUpError?.surnameError}</Text>
            </View>
          )}
        </View>

        {/* Submit button */}
        <View style={styles.buttonContainer}>
          <SubmitButton
            title="Next"
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
            onPress={signUpHandler}
          />
        </View>

        {/* rapper images */}
        <View style={styles.imageContainer}>
          <Image
            source={images.rapperOne}
            resizeMode="cover"
            style={styles.rapperOne}
          />
          <Image
            source={images.rapperTwo}
            resizeMode="cover"
            style={styles.rapperTwo}
          />
          <Image
            source={images.rapperThree}
            resizeMode="cover"
            style={styles.rapperThree}
          />
          <Image
            source={images.rapperFour}
            resizeMode="cover"
            style={styles.rapperFour}
          />
          <Image
            source={images.rapperFive}
            resizeMode="cover"
            style={styles.rapperFive}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  loginContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: COLORS.headingTextColor,
    fontSize: hp(5),
    fontWeight: "bold",
    marginTop: hp(5),
  },
  formContainer: {
    marginTop: wp(10),
  },
  buttonContainer: {
    marginTop: hp(2),
  },
  forgotContainer: {
    marginTop: wp(5),
    width: wp(80),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  forgotText: {
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2),
    color: COLORS.white,
  },
  imageContainer: {
    position: "absolute",
    zIndex: -1,
  },
  rapperOne: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(30),
    top: hp(22),
    left: hp(10),
    borderRadius: wp(15),
  },
  rapperTwo: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(30),
    top: hp(20),
    right: hp(5),
    borderRadius: wp(15),
  },
  rapperThree: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(30),
    top: hp(32),
    right: hp(-8),
    borderRadius: wp(15),
  },
  rapperFour: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(29),
    top: hp(40),
    left: hp(10),
    borderRadius: wp(15),
  },
  rapperFive: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(30),
    top: hp(38),
    right: hp(12),
    borderRadius: wp(15),
  },
  errorContainer: {
    flexDirection: "row",
    marginTop: hp(1),
    marginHorizontal: hp(1),
  },
  errorText: {
    fontFamily: "OpenSans-Medium",
    fontSize: hp(1.8),
    color: COLORS.white,
  },
});

export default SignupStepOne;
