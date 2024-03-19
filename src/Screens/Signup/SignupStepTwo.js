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
import TextInputPassword from "../../Components/TextInputPassword";
import { COLORS, images } from "../../Constant";
import { Validation } from "../../hooks/InputValidation";
import Icons from "react-native-vector-icons/Ionicons";
import LoadingOverlay from "../../Components/LoadingOverlay";
import { signUp } from "../../http";
import { showMessage } from "react-native-flash-message";

const SignupStepTwo = (props) => {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [signUpInput, setSignUpInput] = useState({
    emailValue: null,
    passwordValue: null,
    confirmPasswordValue: null,
  });
  const [signUpError, setSignUpError] = useState({
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
  });

  const handleInputs = (value, field) => {
    setSignUpInput((prev) => {
      prev[field] = value;
      return prev;
    });
  };

  const SignUpHandler = useCallback(async () => {
    LoadingOverlay.show("Loading...");
    setSignUpError({
      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
    });

    const errorData = Validation(signUpInput);
    if (errorData?.email || errorData?.password || errorData?.confirmPassword) {
      LoadingOverlay.hide();
      setSignUpError({
        emailError: errorData?.email,
        passwordError: errorData?.password,
        confirmPasswordError: errorData?.confirmPassword,
      });
    } else {
      LoadingOverlay.show("Loading...");
      const params = {
        name: props?.route?.params?.UserInfo?.nameValue,
        surname: props?.route?.params?.UserInfo?.surnameValue,
        email: signUpInput?.emailValue,
        password: signUpInput?.passwordValue,
        confirm_password: signUpInput?.confirmPasswordValue,
      };
      try {
        const { data } = await signUp(params);
        if (data?.success) {
          LoadingOverlay.show("Loading...");
          showMessage({
            message: "registration successfully",
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
          props?.navigation.reset({
            index: 0,
            routes: [{ name: "Landing" }],
          });
        }
      } catch (err) {
        LoadingOverlay.hide();
        throw err;
      }
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
        {/* Email & Password textInput */}
        <View style={styles.formContainer}>
          <TextInputName
            title="Mail"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "emailValue")}
            keyType="default"
            nextFocus={passwordRef}
            firstInput={true}
          />
          {signUpError?.emailError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {signUpError?.emailError}</Text>
            </View>
          )}
          <TextInputPassword
            refs={passwordRef}
            title="Password"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "passwordValue")}
            keyType="default"
            nextFocus={confirmPasswordRef}
            secure={true}
          />
          {signUpError?.passwordError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}>
                {" "}
                {signUpError?.passwordError}
              </Text>
            </View>
          )}
          <TextInputPassword
            refs={confirmPasswordRef}
            title="Confirm password"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "confirmPasswordValue")}
            keyType="default"
            secure={true}
          />
          {signUpError?.confirmPasswordError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}>
                {" "}
                {signUpError?.confirmPasswordError}
              </Text>
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
            onPress={SignUpHandler}
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
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  loginText: {
    color: COLORS.headingTextColor,
    fontSize: hp(5),
    fontWeight: "bold",
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
    top: hp(20),
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
    width: wp(30),
    top: hp(38),
    left: hp(10),
    borderRadius: wp(15),
  },
  rapperFive: {
    position: "absolute",
    height: Platform.OS === "ios" ? hp(13.5) : hp(15),
    width: wp(30),
    top: hp(36),
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

export default SignupStepTwo;
