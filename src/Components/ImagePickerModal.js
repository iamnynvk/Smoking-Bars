import React from "react";
import { SafeAreaView, Text, Image, Pressable, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../Constant";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export function ImagePickerModal({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
}) {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <SafeAreaView style={styles.buttons}>
        <Pressable style={styles.button} onPress={onImageLibraryPress}>
          <Icon name="document" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Library</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCameraPress}>
          <Icon name="camera" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  buttonIcon: {
    fontSize: 30,
    color: COLORS.primary,
    margin: 10,
  },
  buttons: {
    backgroundColor: "white",
    flexDirection: "row",
    borderTopRightRadius: hp(3),
    borderTopLeftRadius: hp(3),
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: hp(1.8),
    fontFamily: "OpenSans-Bold",
    paddingBottom: hp(1),
  },
});
