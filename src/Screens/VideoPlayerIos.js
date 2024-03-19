import React, { memo, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import Video from "react-native-video";
import useOrientation from "../hooks/useOrientation";
import Icons from "react-native-vector-icons/Ionicons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";

const VideoPlayerIos = (props) => {
  const videoRef = useRef();
  const screenOrientation = useOrientation();
  const [focus, setFocus] = useState(true);

  useEffect(() => {
    Orientation?.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    const subscribe = setTimeout(() => {
      setFocus(false);
    }, 3000);

    return () => clearTimeout(subscribe);
  }, [focus]);

  return (
    <SafeAreaView style={styles.container} onTouchStart={() => setFocus(true)}>
      {screenOrientation?.isPortrait === false && <StatusBar hidden />}

      {/* Back button */}

      {focus && (
        <TouchableOpacity
          onPress={() => props?.navigation?.goBack()}
          style={{
            marginStart: hp(1),
            marginTop: hp(1),
            width: 35,
          }}
        >
          <Icons
            name="chevron-back-outline"
            size={hp(4)}
            color={COLORS.white}
            style={styles.logo}
          />
        </TouchableOpacity>
      )}

      {/* Video screen design Style */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{
            uri: props?.route?.params?.VideoDetails?.url,
          }}
          style={styles.videoControl}
          controls={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    zIndex: -1,
  },
  videoControl: {
    height: "100%",
    width: "100%",
  },
  backHandler: {},
  logo: {},
});

export default memo(VideoPlayerIos);
