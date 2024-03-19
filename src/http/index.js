import axios from "axios";
import { URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import Icons from "react-native-vector-icons/Ionicons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";
import * as RootNavigation from "../Routes/RootNavigation";

const api = axios.create({
  baseURL: URL.api,
});

api.interceptors.request.use(
  async (config) => {
    const newConfig = config;
    const authToken = JSON.parse(await AsyncStorage.getItem("User"))?.token;
    console.log("USER TOKEN :--> ", authToken);
    if (authToken) {
      newConfig.headers.Authorization = `Bearer ${authToken}`;
    }
    return newConfig;
  },
  (err) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(
      "error?.response?.data?.data ---->",
      error?.response?.data?.message,
      error?.response?.status
    );
    if (error?.message == "Network Error") {
      showMessage({
        message: "Warning!",
        description: error?.message,
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
      return Promise.reject(error);
    } else {
      if (error?.response?.status == 401) {
        await AsyncStorage.getAllKeys()
          .then((keys) => AsyncStorage.multiRemove(keys))
          .then(() => {
            RootNavigation.replace("Login");
          });
      }
      showMessage({
        message: "Warning!",
        description:
          error?.response?.status == 401
            ? error?.response?.data?.data?.error
            : error?.response?.data?.message?.length > 0
            ? error?.response?.data?.message
            : error?.response?.status == 403
            ? "Forbidden"
            : "Something went wrong. Please try again.",
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
      return Promise.reject(error?.response?.data?.errors);
    }
  }
);

export default api;

// API's List

export const signUp = (params) => api.post("/signup", params);
export const signIn = (params) => api.post("/signin", params);
export const forgotPassword = (params) => api.post("/forgot-password", params);
export const otpVerify = (params) => api.post("/verify-otp", params);
export const resendOTP = (params) => api.post("/resend-otp", params);
export const resetPasswords = (params) => api.post("/reset-password", params);
export const contactUs = (params) => api.post("/contact-us", params);
export const logout = (params) => api.post("/logout", params);
export const getProfile = () => api.get("/my-profile");
export const profileUpdate = (params) => api.put("/my-profile", params);
export const getVideoList = (params) => api.post("/videos", params);
export const getVideoDetails = (params) => api.post("/video-detail", params);
export const getPlans = (params) => api.post("/plans", params);
export const purchasePlans = (params) => api.post("/purchase-plan", params);
