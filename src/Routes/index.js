import React, { useRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { COLORS } from "../Constant/theme";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { navigationRef } from "./RootNavigation";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.black,
    background: COLORS.black,
  },
};

const Router = ({ token }) => {
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <StatusBar
        backgroundColor={COLORS.black}
        barStyle={"light-content"}
        translucent={false}
      />
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Router;
