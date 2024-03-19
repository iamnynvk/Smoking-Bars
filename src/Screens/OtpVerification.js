import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../Components/Header";
import { COLORS, images } from "../Constant";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Icons from "react-native-vector-icons/Ionicons";
import SubmitButton from "../Components/SubmitButton";
import { Validation } from "../hooks/InputValidation";
import LoadingOverlay from "../Components/LoadingOverlay";
import { otpVerify, resendOTP } from "../http";
import { showMessage } from "react-native-flash-message";

const OtpVerification = (props) => {
  const [otp, setOtp] = useState({
    otpValue: null,
  });
  const [otpVerifyError, setOtpVerifyError] = useState({
    otpError: null,
  });
  const [count, setCount] = useState(120);

  const secondsToDisplay = count % 60;
  const minutesRemaining = (count - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

  useEffect(() => {
    const timers = count > 0 && setInterval(() => setCount(count - 1), 1000);

    return () => clearInterval(timers);
  }, [count]);

  const resendOTPHandler = async () => {
    LoadingOverlay.show("Loading...");
    const params = {
      email: props?.route?.params?.userEmail,
    };
    try {
      const { data } = await resendOTP(params);
      if (data?.success) {
        LoadingOverlay?.show("Loading...");
        setCount(120);
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
      throw err;
    }
  };

  const otpVerificationHandler = async () => {
    LoadingOverlay.show("Loading...");
    setOtpVerifyError({
      otpError: null,
    });

    const errorData = Validation(otp);
    if (errorData?.otp) {
      LoadingOverlay.hide();
      setOtpVerifyError({
        otpError: errorData?.otp,
      });
    } else {
      const params = {
        email: props?.route?.params?.userEmail,
        otp: otp?.otpValue,
      };
      try {
        const { data } = await otpVerify(params);
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
          props?.navigation?.replace("ResetPassword", {
            params,
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
        console.log("Error in OTP Verification ----->", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header component */}
      <Header backPress={() => props?.navigation?.goBack()} />

      <ScrollView style={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.mainContainer}
        >
          <View style={styles.imageContainer}>
            <Image
              source={images.otpVerification}
              style={styles.imageContent}
              resizeMode="contain"
            />
          </View>

          {/* Otp verification text here */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Verification Code</Text>
            <Text style={styles.subTitle} numberOfLines={2}>
              We have send the code verification to your email address
            </Text>
          </View>

          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>
              {props?.route?.params?.userEmail}
            </Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => props?.navigation?.goBack()}
              >
                <Icons
                  name="ios-pencil"
                  size={hp(2)}
                  style={styles.pen}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputOTPContainer}>
            <OTPInputView
              style={styles.otpInput}
              pinCount={6}
              codeInputFieldStyle={styles.codeInputField}
              codeInputHighlightStyle={styles.codeInputHighlight}
              onCodeFilled={(otpCode) =>
                setOtp({
                  otpValue: otpCode,
                })
              }
              placeholderCharacter={"\u2B24"}
              autoFocus={true}
              autoFocusOnLoad={true}
              keyboardType="number-pad"
              placeholderTextColor={COLORS.searchIconColor}
            />
          </View>
          {otpVerifyError?.otpError && (
            <View style={styles.errorContainer}>
              <Icons name="warning-outline" size={hp(2)} color={COLORS.white} />
              <Text style={styles.errorText}> {otpVerifyError?.otpError}</Text>
            </View>
          )}

          {/* resend otp */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the OTP? </Text>
            {count != 0 ? (
              <Text style={styles.resentOTP}>{`0${minutesToDisplay}:${
                secondsToDisplay > 9 ? secondsToDisplay : "0" + secondsToDisplay
              }`}</Text>
            ) : (
              <TouchableOpacity activeOpacity={0.7} onPress={resendOTPHandler}>
                <Text style={styles.resentOTP}>RESEND OTP</Text>
              </TouchableOpacity>
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
              onPress={otpVerificationHandler}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  imageContainer: {
    height: hp(25),
    width: "100%",
    marginVertical: hp(3.5),
  },
  imageContent: {
    height: "100%",
    width: "100%",
  },
  headingContainer: {
    alignItems: "center",
  },
  heading: {
    color: COLORS.headingTextColor,
    fontFamily: "OpenSans-Bold",
    fontSize: hp(3),
  },
  subTitle: {
    color: COLORS.white,
    marginHorizontal: hp(6),
    marginTop: hp(3),
    textAlign: "center",
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2.1),
  },
  emailContainer: {
    marginHorizontal: hp(1),
    flexDirection: "row",
    marginTop: hp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    color: COLORS.white,
    fontFamily: "OpenSans-Regular",
    fontSize: hp(2),
  },
  iconContainer: {
    marginStart: hp(1),
    width: wp(8),
    height: hp(4),
    borderRadius: wp(4),
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  pen: {
    justifyContent: "center",
  },
  inputOTPContainer: {
    marginTop: hp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: "80%",
    height: hp(3),
    margin: wp(7),
  },
  codeInputField: {
    width: wp(12),
    height: hp(6),
    borderRadius: wp("3%"),
    color: COLORS.white,
    borderColor: COLORS.searchIconColor,
    fontFamily: "OpenSans-Bold",
    fontSize: hp(2.2),
  },
  codeInputHighlight: {
    borderColor: COLORS.white,
  },
  buttonContainer: {
    marginTop: hp(2),
  },
  errorContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: hp(1),
  },
  errorText: {
    fontFamily: "OpenSans-Medium",
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  resendContainer: {
    marginTop: hp(2),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  resendText: {
    color: COLORS.white,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(1.8),
  },
  resentOTP: {
    color: COLORS.headingTextColor,
    fontFamily: "OpenSans-Bold",
    fontSize: hp(1.9),
  },
});

export default OtpVerification;
