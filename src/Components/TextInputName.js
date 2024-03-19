import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";
import LoginValidate from "../hooks/InputValidation";

const TextInputName = ({
  title,
  refs,
  textContent,
  keyType,
  handleValue,
  secure,
  nextFocus,
  firstInput,
  editables,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.textContainer, textContent]}>
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={styles.inputContainer}
      >
        <TextInput
          ref={refs}
          keyboardType={keyType}
          style={styles.inputStyle}
          textAlign={"center"}
          autoFocus={firstInput}
          onChangeText={(v) => handleValue(v)}
          secureTextEntry={secure}
          onSubmitEditing={() => {
            nextFocus?.current?.focus();
          }}
          editable={editables}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  textTitle: {
    color: COLORS.white,
    fontSize: hp(2.5),
    fontFamily: "OpenSans-Bold",
    justifyContent: "center",
    alignSelf: "center",
  },
  inputContainer: {
    marginTop: hp(2),
  },
  inputStyle: {
    backgroundColor: COLORS.textInputColor,
    padding: wp(2),
    width: hp(40),
    borderRadius: hp(2),
    overflow: "hidden",
    color: COLORS.white,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2),
  },
});

export default TextInputName;
