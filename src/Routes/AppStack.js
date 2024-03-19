import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { COLORS } from "../Constant/theme";

// Screens
import Home from "../Screens/Home";
import VideoPlayerAndroid from "../Screens/VideoPlayerAndroid";
import Profile from "../Screens/Profile";
import PremiumPlan from "../Screens/PremiumPlan";
import MyAccount from "../Screens/MyAccount";
import ContactCenter from "../Screens/ContactCenter";
import Landing from "../Screens/Landing";
import { Platform } from "react-native";
import Login from "../Screens/Login";
import SignupStepOne from "../Screens/Signup/SignupStepOne";
import SignupStepTwo from "../Screens/Signup/SignupStepTwo";
import ForgotPassword from "../Screens/ForgotPassword";
import OtpVerification from "../Screens/OtpVerification";
import ResetPassword from "../Screens/ResetPassword";
import VideoPlayerIos from "../Screens/VideoPlayerIos";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Home"}
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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="VideoPlayerAndroid" component={VideoPlayerAndroid} />
      <Stack.Screen name="VideoPlayerIos" component={VideoPlayerIos} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PremiumPlan" component={PremiumPlan} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="ContactCenter" component={ContactCenter} />
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignupStepOne" component={SignupStepOne} />
      <Stack.Screen name="SignupStepTwo" component={SignupStepTwo} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AppStack;
