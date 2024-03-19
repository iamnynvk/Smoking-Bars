import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#714495",
  white: "#ffffff",
  black: "#000000",
  btnGradientOne: "#e91585",
  btnGradientTwo: "#8a70ad",
  btnGradientThree: "#2ec9d5",
  darkGray: "#454444",
  headingTextColor: "#2dcad5",
  textColor: "#767676",
  searchPannelColor: "#343434",
  searchIconColor: "#6f6f6f",
  textInputColor: "#262626",
  upgradeButton: "#14e2e0",
  profileButton: "#1f1f1f",
  danger: "#f32013",
  success: "#4BB543",
  lightWhite: "#c9c9c9",
  lightGreen: "#31A05F",
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,
};

const appTheme = { COLORS, SIZES };

export default appTheme;
