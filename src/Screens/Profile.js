import React, { useContext, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native";
import AppHeader from "../Components/AppHeader";
import ButtonSection from "../Components/ButtonSection";
import { COLORS } from "../Constant";
import LoadingOverlay from "../Components/LoadingOverlay";
import { getProfile, logout } from "../http";
import { showMessage } from "react-native-flash-message";
import Icons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthProvider";

const Profile = (props) => {
  const route = useRoute();
  const { setUserDetail } = useContext(AuthContext);

  const logOutUser = async () => {
    LoadingOverlay.show("Logout...");
    try {
      const { data } = await logout();
      if (data?.success) {
        LoadingOverlay.hide();
        showMessage({
          message: "Successfully Logout",
          description: data?.message,
          type: "default",
          backgroundColor: COLORS.success,
          color: COLORS.white,
          icon: (props) => (
            <Icons
              name="checkmark-circle-sharp"
              size={hp(2)}
              color={COLORS.white}
              {...props}
            />
          ),
        });
        await AsyncStorage.getAllKeys()
          .then((keys) => AsyncStorage.multiRemove(keys))
          .then(() => {
            console.log("Remove all the data in localstorage");
            LoadingOverlay.hide();
            props?.navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
          });
      } else {
        LoadingOverlay.hide();
        showMessage({
          message: "Warning!",
          description: data?.message,
          type: "default",
          backgroundColor: COLORS.danger,
          color: COLORS.white,
          icon: (props) => (
            <Icons
              name="warning-outline"
              size={hp(2)}
              color={COLORS.white}
              {...props}
            />
          ),
        });
      }
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  };

  useEffect(() => {
    props?.navigation?.addListener("focus", () => {
      getUserDetail();
    });
  }, []);

  const getUserDetail = async () => {
    try {
      const { data } = await getProfile();
      if (data?.success) {
        setUserDetail(data?.data);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader screen={route?.name} />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Upgrade plan sections */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => props?.navigation.navigate("PremiumPlan")}
          >
            <View style={styles.planUpgradeContainer}>
              <Text style={styles.planUpgradeText}>Upgrade plan</Text>
            </View>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props?.navigation?.navigate("MyAccount")}
            >
              <ButtonSection title="My account" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props?.navigation?.navigate("ContactCenter")}
            >
              <ButtonSection title="Contact center" />
            </TouchableOpacity>

            <TouchableOpacity onPress={logOutUser} activeOpacity={0.7}>
              <ButtonSection title="Log out" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  planUpgradeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(5),
    height: hp(20),
    backgroundColor: COLORS.upgradeButton,
  },
  planUpgradeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: hp(4),
    color: COLORS.white,
  },
});

export default Profile;
