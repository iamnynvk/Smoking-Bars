import React, { memo } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, images } from "../Constant";

const PlanCard = ({ image, payout, duration, plan, planDetail }) => {
  return (
    <SafeAreaView
      style={[
        styles.trialContainer,
        planDetail?.plan_name == plan && {
          borderWidth: 1.5,
          borderColor: COLORS.white,
        },
      ]}
    >
      <ImageBackground
        source={{ uri: image, cache: "force-cache" }}
        style={styles.imageStyles}
        resizeMode="cover"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginHorizontal: hp(3),
            marginTop: hp(1),
          }}
        >
          <Text
            style={[
              styles.labelText,
              {
                fontWeight: "bold",
                fontFamily: "OpenSans-ExtraBold",
                textTransform: "uppercase",
              },
            ]}
          >
            {payout === 0 ? "Free/" : `${payout} $/`}
          </Text>
          <Text style={styles.labelText}>{duration}</Text>
        </View>

        <View style={styles.trialtextContainer}>
          <Text
            style={[
              styles.textStyles,
              {
                color:
                  plan == "Premium" ? COLORS.white : COLORS.headingTextColor,
              },
            ]}
          >
            {plan}
          </Text>
        </View>

        {planDetail?.plan_name == plan && (
          <View style={styles.selectedPlanContainer}>
            <Text style={styles.planText}>{`  Current Plan`}</Text>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  trialContainer: {
    height: hp(30),
    margin: hp(1),
    borderRadius: hp(2),
    overflow: "hidden",
  },
  imageStyles: {
    width: "100%",
    height: "100%",
  },
  labelText: {
    fontSize: hp(2.5),
    color: COLORS.white,
    fontFamily: "OpenSans-Regular",
  },
  trialtextContainer: {
    margin: hp(6),
  },
  textStyles: {
    fontSize: hp(5),
    textTransform: "uppercase",
    fontFamily: "OpenSans-ExtraBold",
    opacity: 0.9,
  },
  selectedPlanContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: hp(5),
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  planText: {
    fontFamily: "OpenSans-Bold",
    fontSize: hp(2.1),
  },
});

export default memo(PlanCard);
