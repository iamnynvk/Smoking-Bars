import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Platform,
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
import PlanCard from "../Components/PlanCard";
import { COLORS, images } from "../Constant";
import Icons from "react-native-vector-icons/Ionicons";
import { getPlans, purchasePlans } from "../http";
import LoadingOverlay from "../Components/LoadingOverlay";
import { showMessage } from "react-native-flash-message";
import { FlashList } from "@shopify/flash-list";
import {
  initConnection,
  getSubscriptions,
  getPurchaseHistory,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  endConnection,
  validateReceiptAndroid,
  validateReceiptIos,
} from "react-native-iap";
import { AuthContext } from "../context/AuthProvider";

const items = Platform.select({
  ios: [],
  android: ["rnIap_off_60"],
});

const PremiumPlan = (props) => {
  const { userDetail } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [product, setProduct] = useState({});
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    getPlansDetails();
  }, []);

  useEffect(() => {
    initConnection()
      .catch(() => {
        console.log("error connection to store...");
      })
      .then(() => {
        getSubscriptions(items)
          .catch(() => {
            console.log("error finding items");
          })
          .then((res) => {
            console.log("res from get subscription--->", res);
            setProduct(res);
          });
      });

    getPurchaseHistory()
      .catch(() => {
        console.log("error for getHistory of purchase");
      })
      .then((res) => {
        try {
          console.log("respp from history ---->", res);
          const receipt = res[res.length - 1].transactionReceipt;
          if (receipt) {
            console.log("receipt here from history---->", receipt);
            validatePurchase(receipt);
          }
        } catch (err) {
          console.log("Error from exception from history---->", err);
        }
      });

    let purchaseErrorSubscription = purchaseErrorListener((error) => {
      if (!(error["responseCode"] === "2")) {
        Alert.alert(
          "Warning",
          "There has been an error with your purchase, error code" +
            error["code"]
        );
      }
    });

    let purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        validatePurchase(receipt);
        finishTransaction(purchase, false);
      }
    });

    return () => {
      try {
        purchaseUpdateSubscription.remove();
      } catch (err) {}

      try {
        purchaseErrorSubscription.remove();
      } catch (err) {}

      try {
        endConnection();
      } catch (err) {}
    };
  }, []);

  const validatePurchase = async (receipt) => {
    console.log("Calling Api & upload receipt in backend side --->", receipt);
    const receiptBody = {
      "receipt-data": receipt,
      password: "fgkdshfkjdhskfhskfgsdkjfgjh0oi9vnklvd",
    };

    const result = await validateReceiptAndroid(receiptBody, true)
      .catch(() => {})
      .then((receipt) => {
        try {
          const expired = Date.now() > receipt.expiryTimeMillis;
          if (!expired) {
            setPurchased(true);
          } else {
            Alert.alert([
              "Purchase Expired!",
              "Your subscription has been expired.",
            ]);
          }
        } catch (err) {}
      });
  };

  const getPlansDetails = async () => {
    try {
      LoadingOverlay.show("Loading...");
      const { data } = await getPlans({});
      if (data?.success) {
        setPlans(data?.data);
        LoadingOverlay.hide();
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
      console.log("Error get Plans screen --->", err);
      throw err;
    }
  };

  const purchasePlan = async (plan) => {
    LoadingOverlay.show("Loading...");
    const params = {
      user_id: userDetail?.id,
      plan_id: plan?.id,
      amount: "10",
      payment_id: "12541",
    };
    try {
      const { data } = await purchasePlans(params);
      if (data?.success) {
        LoadingOverlay.hide();
        Alert.alert("Successfully", data?.message, [
          {
            text: "Ok",
            onPress: () =>
              props?.navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              }),
          },
        ]);
        showMessage({
          message: "Successfully",
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
      LoadingOverlay.hide();
    } catch (err) {
      LoadingOverlay.hide();
      console.log("Error from PremiumPlan screen --->", err);
      throw err;
    }
  };

  const renderItems = (plansDetail) => {
    return (
      <TouchableOpacity
        disabled={plansDetail?.id == userDetail?.plan_id}
        activeOpacity={0.7}
        onPress={() => purchasePlan(plansDetail)}
      >
        <PlanCard
          image={plansDetail?.thumbnail}
          payout={plansDetail?.amount}
          duration={plansDetail?.time_period}
          plan={plansDetail?.name}
          planDetail={userDetail}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => props?.navigation?.goBack()}
          >
            <Icons
              name="chevron-back-outline"
              size={hp(4)}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.planText}>Choose your plan</Text>
        </View>
      </View>

      <FlashList
        estimatedItemSize={10}
        data={plans}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => renderItems(item)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: hp(12),
    flexDirection: "row",
    alignItems: "center",
  },
  backContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: COLORS.textColor,
    fontSize: hp(3),
    fontFamily: "OpenSans-Bold",
  },
  planText: {
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
  },
});

export default PremiumPlan;
