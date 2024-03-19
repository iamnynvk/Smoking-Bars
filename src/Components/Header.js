import React, { memo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";
import LogoName from "./LogoName";
import Icons from "react-native-vector-icons/Ionicons";

const Header = ({ backPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={backPress}>
          <Icons
            name="chevron-back-outline"
            size={hp(4)}
            color={COLORS.white}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.logoNameContainer}>
        <LogoName
          logoHeight={hp(9)}
          logoWidth={wp(12)}
          textSize={hp(2)}
          lineHeights={hp(1.5)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(10),
    flexDirection: "row",
  },
  backContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {},
  logoNameContainer: {
    flex: 2,
    flexDirection: "row-reverse",
    paddingStart: hp(5),
  },
});

export default memo(Header);
