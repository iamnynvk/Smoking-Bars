import React, { memo } from "react";
import {
  ImageBackground,
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
import { COLORS, images } from "../Constant";

const VideoCard = ({ item, onVideoPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onVideoPress(item)}>
        <ImageBackground
          source={{
            uri: item?.thumbnail,
          }}
          style={styles.cardContainer}
        >
          <Text style={styles.textDate}>
            {item?.date?.split("/")?.join(".")}
          </Text>
          <Text style={styles.textContent}>{item?.title}</Text>
          <Text style={styles.textStyles}>{item?.sub_title}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{item?.duration}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(28),
    marginTop: hp(1.5),
  },
  cardContainer: {
    height: "100%",
    width: "100%",
  },
  textDate: {
    position: "absolute",
    right: hp(2),
    top: hp(2),
    color: COLORS.textColor,
    fontFamily: "OpenSans-Medium",
  },
  textContent: {
    textTransform: "uppercase",
    position: "absolute",
    bottom: hp(5),
    left: hp(3),
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: "OpenSans-Bold",
    fontWeight: "bold",
  },
  textStyles: {
    textTransform: "uppercase",
    position: "absolute",
    bottom: hp(2),
    left: hp(3),
    color: COLORS.headingTextColor,
    fontSize: hp(2.2),
    fontFamily: "OpenSans-Regular",
  },
  durationContainer: {
    backgroundColor: COLORS.black,
    borderRadius: hp(0.3),
    alignSelf: "flex-end",
    position: "absolute",
    bottom: hp(1.5),
    right: hp(1.5),
    paddingHorizontal: 4,
  },
  duration: {
    color: COLORS.white,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(1.5),
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});

export default memo(VideoCard);
