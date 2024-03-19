import React, { useEffect, useState } from "react";
import Router from "./src/Routes";
import { SafeAreaView } from "react-native";
import SplashScreen from "react-native-splash-screen";
import FlashMessage from "react-native-flash-message";
import LoadingOverlay, {
  LoadingOverlayRef,
} from "./src/Components/LoadingOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./src/Constant";
import AuthProvider from "./src/context/AuthProvider";

const App = () => {
  const [tokens, setTokens] = useState();

  useEffect(() => {
    setTimeout(
      () => {
        SplashScreen.hide();
      },
      tokens ? 50 : 200
    );
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = JSON.parse(await AsyncStorage.getItem("User"))?.token;
    setTokens(token);
  };

  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
        <Router token={tokens} />
        <FlashMessage position="top" />
        <LoadingOverlay ref={LoadingOverlayRef} />
      </SafeAreaView>
    </AuthProvider>
  );
};

export default App;
