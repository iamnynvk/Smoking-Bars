import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import Material from "react-native-vector-icons/MaterialIcons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS } from "../Constant";
import Orientation from "react-native-orientation-locker";
import Video from "react-native-video";
import useOrientation from "../hooks/useOrientation";
import Slider from "@react-native-community/slider";

const VideoPlayer = (props) => {
  const videoRef = useRef();
  const screenOrientation = useOrientation();
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(true);
  const [controlShow, setControlShow] = useState(true);
  const [screen, setScreen] = useState(
    screenOrientation?.isPortrait ? "contain" : "stretch"
  );
  const [loader, setLoader] = useState(true);
  const [duration, setDuration] = useState(0.0);
  const [progress, setProgress] = useState(0);
  const [getPosition, setGetPosition] = useState(null);

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

  const handleOnLoad = (loadData) => {
    loadData?.naturalSize ? setLoader(false) : setLoader(true);
    setDuration(loadData?.duration);
  };

  const handleOnProgress = (onProgressData) => {
    setProgress(onProgressData?.currentTime / duration);
  };

  const handleOnEnd = (onEndData) => {
    setPaused(true);
  };

  const secondsToTime = (time) => {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60);
  };

  const handleProgressMovePress = (value) => {
    setLoader(true);
    const position = value?.nativeEvent?.locationX;
    setGetPosition(position);
    const progress = (position / 500) * duration;
    videoRef?.current?.seek(progress);
  };

  const previousHandler = (time) => {
    const progress = (getPosition / 500) * (duration - time);
    videoRef?.current?.seek(progress);
  };

  const PlayPauseHandler = () => {
    if (progress >= 1) {
      videoRef?.current?.seek(0);
    }
    setPaused(!paused);
  };

  const nextHandler = (time) => {
    const progress = (getPosition / 500) * (duration + time);
    videoRef?.current?.seek(progress);
  };

  return (
    <SafeAreaView style={styles.container} onTouchStart={() => setFocus(true)}>
      {screenOrientation?.isPortrait === false && <StatusBar hidden />}

      {!controlShow && (
        <View style={[styles.headerContainer, { position: "absolute" }]}>
          <View
            style={[
              styles.screenViewContainer,
              {
                marginStart: hp(5),
                marginTop: hp(3),
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (controlShow) {
                  screenOrientation?.isPortrait
                    ? Orientation?.lockToPortrait()
                    : Orientation?.lockToLandscape();
                  setControlShow(false);
                } else {
                  Orientation?.unlockAllOrientations();
                  setControlShow(true);
                }
              }}
            >
              {controlShow ? (
                <Icons
                  name="ios-lock-open-outline"
                  size={hp(4)}
                  color={COLORS.white}
                />
              ) : (
                <Icons
                  name="lock-closed-outline"
                  size={hp(4)}
                  color={COLORS.white}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {focus && controlShow && (
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
            style={[
              styles.titleContainer,
              { width: screenOrientation?.isPortrait ? "50%" : "80%" },
            ]}
          >
            <Text
              style={styles.textStyle}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {props?.route?.params?.VideoDetails?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              left: 0,
              right: 0,
            }}
          >
            <View style={styles.screenViewContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  screen == "stretch"
                    ? setScreen("contain")
                    : setScreen("stretch")
                }
              >
                {screen === "stretch" ? (
                  <Icons
                    name="scan-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                ) : (
                  <Icons name="ios-expand" size={hp(4)} color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.screenViewContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (controlShow) {
                    screenOrientation?.isPortrait
                      ? Orientation?.lockToPortrait()
                      : Orientation?.lockToLandscape();
                    setControlShow(false);
                  } else {
                    Orientation?.unlockAllOrientations();
                    setControlShow(true);
                  }
                }}
              >
                {controlShow ? (
                  <Icons
                    name="ios-lock-open-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                ) : (
                  <Icons
                    name="lock-closed-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {loader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            style={{ flex: 1 }}
            size={"large"}
            color={COLORS.white}
          />
        </View>
      )}

      {/* Control Buttons */}
      {loader ? (
        <></>
      ) : focus && controlShow ? (
        <View style={styles.controlContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => previousHandler(10)}
          >
            <Material name="replay-10" size={hp(5)} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{ marginHorizontal: 30 }}
            onPress={PlayPauseHandler}
          >
            <Icons
              name={
                paused ? "ios-play-circle-outline" : "ios-pause-circle-outline"
              }
              size={hp(8)}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => nextHandler(10)}>
            <Material name="forward-10" size={hp(5)} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}

      {/* Video seekBar */}
      {controlShow && focus && (
        <View style={styles.controlContainer}>
          <Slider
            style={styles.videoSeek}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={COLORS.white}
            maximumTrackTintColor={COLORS.white}
            value={progress}
            onResponderMove={(e) => handleProgressMovePress(e)}
          />
        </View>
      )}

      {controlShow && focus && (
        <View
          style={[
            styles.timerContainer,
            {
              paddingHorizontal: screenOrientation?.isPortrait
                ? hp(2.5)
                : hp(5),
            },
          ]}
        >
          <Text style={[styles.textStyle, { fontSize: hp(1.8), marginTop: 5 }]}>
            {secondsToTime(Math.floor(progress * duration))}
          </Text>
          <Text style={[styles.textStyle, { fontSize: hp(1.8), marginTop: 5 }]}>
            {secondsToTime(Math.floor(duration))}
          </Text>
        </View>
      )}

      {/* Video screen design Style */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{
            uri: props?.route?.params?.VideoDetails?.url,
          }}
          style={styles.videoControl}
          fullscreen={screenOrientation?.isPortrait ? false : true}
          resizeMode={screen}
          paused={paused}
          disableFocus={true}
          progressUpdateInterval={1000}
          onLoad={(e) => handleOnLoad(e)}
          onProgress={(e) => handleOnProgress(e)}
          onEnd={(e) => handleOnEnd(e)}
          onSeek={(e) => setLoader(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: hp(8),
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    right: 0,
    width: "100%",
    justifyContent: "space-between",
  },
  backContainer: {
    width: wp(12),
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignSelf: "center",
    marginHorizontal: hp(2),
    minWidth: hp(29),
    width: "auto",
  },
  textStyle: {
    color: COLORS.white,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2.5),
  },
  screenViewContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginEnd: hp(2),
  },
  videoContainer: {
    flex: 1,
    zIndex: -1,
  },
  videoControl: {
    height: "100%",
    width: "100%",
  },
  loaderContainer: {
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  controlContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  videoSeek: {
    width: "90%",
    alignSelf: "flex-end",
    marginHorizontal: hp(10),
    bottom: hp(5),
  },
  timerContainer: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    justifyContent: "space-between",
    bottom: hp(2.8),
  },
});

export default VideoPlayer;
