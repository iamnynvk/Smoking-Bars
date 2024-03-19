import React, { memo } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, images } from "../Constant";

const LogoName = ({ logoHeight, logoWidth, textSize, lineHeights }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={images.logo}
        style={{ height: logoHeight, width: logoWidth }}
        resizeMode="contain"
      />

      <View style={styles.headingContainer}>
        <Text
          style={[
            styles.textContainer,
            { fontSize: textSize, lineHeight: lineHeights * 1.35 },
          ]}
        >
          smoking{"\n"}bars
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  headingContainer: {
    borderColor: COLORS.white,
    marginStart: wp(1),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textContainer: {
    color: COLORS.white,
    fontFamily: "OpenSans-Bold",
    textTransform: "uppercase",
    includeFontPadding: false,
    opacity: 0.9,
  },
});

export default memo(LogoName);
