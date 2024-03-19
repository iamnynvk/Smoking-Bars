import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "../Constant";
import Header from "../Components/Header";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SubmitButton from "../Components/SubmitButton";
import TextInputPassword from "../Components/TextInputPassword";
import LoadingOverlay from "../Components/LoadingOverlay";
import { Validation } from "../hooks/InputValidation";
import { resetPasswords } from "../http";
import Icons from "react-native-vector-icons/Ionicons";
import { showMessage } from "react-native-flash-message";

const ResetPassword = (props) => {
  const confirmRef = useRef();
  const [resetPassword, setResetPassword] = useState({
    passwordValue: null,
    confirmPasswordValue: null,
  });
  const [resetPasswordError, setResetPasswordError] = useState({
    passwordError: null,
    confirmPasswordError: null,
  });

  const handlePassword = (value) => {
    setResetPassword({
      ...resetPassword,
      passwordValue: value,
    });
  };

  const handleConfirmPassword = (value) => {
    setResetPassword({
      ...resetPassword,
      confirmPasswordValue: value,
    });
  };

  const resetPasswordHandler = async () => {
    LoadingOverlay.show("Loading...");
    setResetPasswordError({
      passwordError: null,
      confirmPasswordError: null,
    });

    const errorData = Validation(resetPassword);
    if (errorData?.password || errorData?.confirmPassword) {
      LoadingOverlay.hide();
      setResetPasswordError({
        passwordError: errorData?.password,
        confirmPasswordError: errorData?.confirmPassword,
      });
    } else {
      const params = {
        email: props?.route?.params?.params?.email,
        otp: props?.route?.params?.params?.otp,
        new_password: resetPassword?.passwordValue,
        confirm_password: resetPassword?.confirmPasswordValue,
      };
      try {
        const { data } = await resetPasswords(params);
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
          props?.navigation.reset({
            index: 0,
            routes: [{ name: "Landing" }],
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
        console.log("Error in Reset screen ---->", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backPress={() => props?.navigation?.goBack()} />

      <View style={styles.childContainer}>
        <Text style={styles.resetText}>Reset Password</Text>

        <View style={styles.formContainer}>
          <TextInputPassword
            title="New Password"
            textContent={{}}
            handleValue={(v) => handlePassword(v)}
            passValue={resetPassword?.passwordValue}
            keyType="default"
            nextFocus={confirmRef}
            secure={true}
          />
          {resetPasswordError?.passwordError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}>
                {" "}
                {resetPasswordError?.passwordError}
              </Text>
            </View>
          )}

          <TextInputPassword
            refs={confirmRef}
            title="Confirm Password"
            textContent={{}}
            handleValue={(v) => handleConfirmPassword(v)}
            passValue={resetPassword?.confirmPasswordValue}
            keyType="default"
            secure={true}
          />
          {resetPasswordError?.confirmPasswordError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}>
                {" "}
                {resetPasswordError?.confirmPasswordError}
              </Text>
            </View>
          )}
        </View>

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
            onPress={resetPasswordHandler}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  childContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resetText: {
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

export default ResetPassword;
