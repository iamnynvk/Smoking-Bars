import React, { useCallback, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import TextInputPassword from "../Components/TextInputPassword";
import { COLORS } from "../Constant";
import { Validation } from "../hooks/InputValidation";
import Icons from "react-native-vector-icons/Ionicons";
import { signIn } from "../http";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../Components/LoadingOverlay";

const Login = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loginInput, SetLoginInput] = useState({
    emailValue: null,
    passwordValue: null,
  });
  const [loginError, setLoginError] = useState({
    emailError: null,
    passwordError: null,
  });

  const handleInputs = (value, field) => {
    SetLoginInput((prev) => {
      prev[field] = value;
      return prev;
    });
  };

  const onSubmitHandler = useCallback(async () => {
    LoadingOverlay.show("Loading...");
    setLoginError({
      emailError: null,
      passwordError: null,
    });

    const errorData = Validation(loginInput);
    if (errorData?.email || errorData?.password) {
      LoadingOverlay.hide();
      setLoginError({
        emailError: errorData?.email,
        passwordError: errorData?.password,
      });
    } else {
      const params = {
        email: loginInput?.emailValue,
        password: loginInput?.passwordValue,
      };
      try {
        const { data } = await signIn(params);
        if (data?.success) {
          LoadingOverlay.show("Loading...");
          const userData = JSON.stringify(data?.data);
          await AsyncStorage.setItem("User", userData);
          showMessage({
            message: "Successfully Login",
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
            routes: [{ name: "Home" }],
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
      } catch (error) {
        LoadingOverlay.hide();
        console.log("Error in Login ----->", error);
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
        <Text style={styles.loginText}>Login</Text>

        {/* Email & Password textInput */}
        <View style={styles.formContainer}>
          <TextInputName
            refs={emailRef}
            title="Mail"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "emailValue")}
            keyType="email-address"
            nextFocus={passwordRef}
            firstInput={true}
          />
          {loginError?.emailError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {loginError?.emailError}</Text>
            </View>
          )}
          <TextInputPassword
            refs={passwordRef}
            title="Password"
            textContent={{}}
            handleValue={(v) => handleInputs(v, "passwordValue")}
            keyType="default"
            secure={true}
          />
          {loginError?.passwordError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {loginError?.passwordError}</Text>
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
            onPress={onSubmitHandler}
          />
        </View>

        {/* Forgot Password */}
        <View style={styles.forgotContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ width: "100%" }}
            onPress={() => props?.navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
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
    alignSelf: "flex-end",
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

export default Login;
