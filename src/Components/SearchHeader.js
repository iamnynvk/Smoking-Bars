import React, { memo } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Icons from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../Constant";

const SearchHeader = ({ searchData, searchHandler }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.inputTextStyle}
        placeholder="Search for battles"
        placeholderTextColor={COLORS.darkGray}
        value={searchData}
        onChangeText={(v) => searchHandler(v)}
      />
      <Icons
        name="search"
        style={styles.searchIcon}
        size={20}
        color={COLORS.searchIconColor}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  inputTextStyle: {
    color: COLORS.white,
    marginHorizontal: hp(6),
    borderRadius: hp(10),
    padding: wp(2),
    width: wp(90),
    overflow: "hidden",
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2),
    backgroundColor: COLORS.textInputColor,
    paddingLeft: hp(2),
  },
  searchIcon: {
    position: "absolute",
    right: wp(8),
    transform: [{ rotateY: "180deg" }],
  },
});

export default memo(SearchHeader);
