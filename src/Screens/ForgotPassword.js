import React, { useRef, useState } from "react";
import {
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
import Header from "../Components/Header";
import SubmitButton from "../Components/SubmitButton";
import TextInputName from "../Components/TextInputName";
import { COLORS } from "../Constant";
import { Validation } from "../hooks/InputValidation";
import Icons from "react-native-vector-icons/Ionicons";
import LoadingOverlay from "../Components/LoadingOverlay";
import { forgotPassword } from "../http";
import { showMessage } from "react-native-flash-message";

const ForgotPassword = (props) => {
  const emailRef = useRef();
  const [forgotPasswordInput, setForgotPasswordInput] = useState({
    emailValue: null,
  });
  const [forgotError, setForgotError] = useState({
    emailError: null,
  });

  const handleInputs = (value, field) => {
    setForgotPasswordInput((prev) => {
      prev[field] = value;
      return prev;
    });
  };

  const forgotPasswordHandler = async () => {
    LoadingOverlay.show("Loading...");
    setForgotError({
      emailError: null,
    });

    const errorData = Validation(forgotPasswordInput);
    if (errorData?.email) {
      LoadingOverlay.hide();
      setForgotError({
        emailError: errorData?.email,
      });
    } else {
      const params = {
        email: forgotPasswordInput?.emailValue,
      };
      try {
        const { data } = await forgotPassword(params);
        if (data?.success) {
          LoadingOverlay.show("Loading...");
          showMessage({
            message: "Success",
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
          props?.navigation?.navigate("OtpVerification", {
            userEmail: forgotPasswordInput?.emailValue,
          });
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
      } catch (err) {
        LoadingOverlay.hide();
        console.log("Error in Forgot password ----->", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header component */}
      <Header backPress={() => props?.navigation?.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginContainer}
      >
        <Text style={styles.loginText}>Forgot Password</Text>

        {/* Email & Password textInput */}
        <View style={styles.formContainer}>
          <TextInputName
            refs={emailRef}
            title="Mail"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "emailValue")}
            keyType="email-address"
            firstInput={true}
          />

          {forgotError?.emailError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {forgotError?.emailError}</Text>
            </View>
          )}
        </View>

        {/* Submit button */}
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
            onPress={forgotPasswordHandler}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: hp(8),
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

export default ForgotPassword;
