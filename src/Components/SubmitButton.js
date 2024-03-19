import React, { memo } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";

const SubmitButton = ({
  title,
  textStyles,
  onPress,
  gradientColor = [COLORS.white, COLORS.white, COLORS.white],
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradientColor}
        style={styles.btnGradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonClickContainer}
          onPress={onPress}
        >
          <Text style={[styles.textContainer, textStyles]}>{title}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(6.5),
    marginHorizontal: hp(10),
    marginTop: wp(5),
    width: wp(62.5),
  },
  buttonClickContainer: {
    height: "100%",
    borderRadius: hp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  btnGradient: {
    borderRadius: hp(5),
  },
  textContainer: {
    fontSize: hp(3),
  },
});

export default memo(SubmitButton);
