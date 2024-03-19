import React, { useEffect } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS, images } from "../Constant/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LogoName from "../Components/LogoName";
import SubmitButton from "../Components/SubmitButton";

const Landing = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.introImage}
        style={styles.imageBackgroundContainer}
        resizeMode={"cover"}
      >
        <LinearGradient
          colors={["#00000000", COLORS.black]}
          style={styles.gradientStyle}
        >
          {/* Logo design */}
          <View style={{ flex: 1.5, margin: wp(10) }}>
            <LogoName
              logoHeight={hp(25)}
              logoWidth={wp(25)}
              textSize={hp(4)}
              lineHeights={hp(3)}
            />
          </View>

          {/* Login & Sing-up Button */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <SubmitButton
              title="Login"
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
              onPress={() => props?.navigation?.navigate("Login")}
            />
            <SubmitButton
              title="Sign up"
              textStyles={{
                fontFamily: "OpenSans-SemiBold",
                color: COLORS.black,
                fontSize: hp(2.5),
              }}
              onPress={() => props?.navigation?.navigate("SignupStepOne")}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundContainer: {
    flex: 1,
  },
  gradientStyle: {
    height: "100%",
    width: "100%",
  },
});

export default Landing;
