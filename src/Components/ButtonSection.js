import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";

const ButtonSection = ({ title }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyles}>{title}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(12),
    marginTop: hp(0.5),
    backgroundColor: COLORS.profileButton,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyles: {
    fontSize: hp(2.1),
    fontFamily: "OpenSans-Bold",
    color: COLORS.white,
  },
});

export default ButtonSection;
