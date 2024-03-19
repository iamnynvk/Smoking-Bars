import React, { memo, useContext, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, images } from "../Constant";
import LogoName from "./LogoName";
import Icons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";

const AppHeader = ({ onPressProfile, screen }) => {
  const navigation = useNavigation();
  const { userDetail } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      {screen == "Profile" && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginStart: hp(1),
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation?.goBack()}
          >
            <Icons
              name="chevron-back-outline"
              size={hp(4)}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ marginStart: screen == "Profile" ? hp(1) : hp(4) }}>
        <LogoName
          logoHeight={hp(13)}
          logoWidth={wp(12)}
          textSize={hp(2)}
          lineHeights={hp(1.5)}
        />
      </View>

      <View style={styles.userLogoContainer}>
        {userDetail?.profile_image ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressProfile}
            disabled={screen == "Profile" && true}
          >
            <Image
              source={{ uri: userDetail?.profile_image }}
              resizeMode="cover"
              style={styles.imageContainer}
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size={"small"} color={COLORS.white} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(15),
    width: "100%",
    flexDirection: "row",
  },
  userLogoContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    marginEnd: hp(4),
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    height: hp(10),
    width: hp(10),
    borderRadius: hp(5),
  },
});

export default memo(AppHeader);
