import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { COLORS } from "../Constant/theme";

// Screens
import Landing from "../Screens/Landing";
import Login from "../Screens/Login";
import SignupStepOne from "../Screens/Signup/SignupStepOne";
import SignupStepTwo from "../Screens/Signup/SignupStepTwo";
import ForgotPassword from "../Screens/ForgotPassword";
import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import VideoPlayerAndroid from "../Screens/VideoPlayerAndroid";
import PremiumPlan from "../Screens/PremiumPlan";
import MyAccount from "../Screens/MyAccount";
import ContactCenter from "../Screens/ContactCenter";
import { Platform } from "react-native";
import OtpVerification from "../Screens/OtpVerification";
import ResetPassword from "../Screens/ResetPassword";
import VideoPlayerIos from "../Screens/VideoPlayerIos";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Landing"}
      screenOptions={{
        headerShown: false,
        headerTintColor: COLORS.primary,
        headerBackground: COLORS.primary,
        presentation: Platform.OS === "android" ? "transparentModal" : "card",
        cardStyle: {
          backgroundColor: COLORS.black,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignupStepOne" component={SignupStepOne} />
      <Stack.Screen name="SignupStepTwo" component={SignupStepTwo} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="VideoPlayerAndroid" component={VideoPlayerAndroid} />
      <Stack.Screen name="VideoPlayerIos" component={VideoPlayerIos} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PremiumPlan" component={PremiumPlan} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="ContactCenter" component={ContactCenter} />
    </Stack.Navigator>
  );
};

export default AuthStack;
