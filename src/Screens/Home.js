import React, { useEffect, useState, memo, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import AppHeader from "../Components/AppHeader";
import SearchHeader from "../Components/SearchHeader";
import { COLORS } from "../Constant/theme";
import VideoCard from "../Components/VideoCard";
import LoadingOverlay from "../Components/LoadingOverlay";
import { getProfile, getVideoDetails, getVideoList } from "../http";
import useDebounce from "../hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";
import { showMessage } from "react-native-flash-message";
import Icons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthProvider";

const Home = (props) => {
  const [searchValue, setSearchValue] = useState(null);
  const { userDetail, setUserDetail } = useContext(AuthContext);
  const debounceSearch = useDebounce(searchValue, 500);
  const [videoData, setVideoData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isAvailable, setIsAvailable] = useState(0);
  const perPageVideo = 10;

  const getSearchValue = (values) => {
    setOffset(1);
    setVideoData([]);
    setSearchValue(values);
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

  const getVideoDetail = async (details) => {
    LoadingOverlay.show("Loading...");
    if (userDetail?.plan_id != null) {
      if (userDetail?.plan_is_unlimited === "0") {
        const params = {
          user_id: userDetail?.id,
          plan_id: userDetail?.plan_id,
          video_id: details?.id,
        };
        try {
          const { data } = await getVideoDetails(params);
          LoadingOverlay.hide();
          if (data?.success) {
            LoadingOverlay.hide();
            if (data?.data?.length == 0) {
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
            } else {
              props?.navigation?.navigate(
                Platform.OS === "android"
                  ? "VideoPlayerAndroid"
                  : "VideoPlayerIos",
                {
                  VideoDetails: data?.data,
                }
              );
            }
          } else {
            LoadingOverlay.hide();
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
          }
        } catch (err) {
          LoadingOverlay.hide();
          console.log("Error from Open video ---->", err);
          throw err;
        }
      } else {
        LoadingOverlay.show("Loading...");
        const params = {
          user_id: userDetail?.id,
          plan_id: userDetail?.plan_id,
          video_id: details?.id,
        };
        try {
          const { data } = await getVideoDetails(params);
          LoadingOverlay.hide();
          if (data?.success) {
            props?.navigation?.navigate(
              Platform.OS === "android"
                ? "VideoPlayerAndroid"
                : "VideoPlayerIos",
              {
                VideoDetails: data?.data,
              }
            );
          } else {
            LoadingOverlay.hide();
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
          }
        } catch (err) {
          LoadingOverlay.hide();
          throw err;
        }
      }
    } else {
      LoadingOverlay.hide();
      showMessage({
        message: "Warning!",
        description:
          "You do not have any subscription plan. Please upgrade your plan.",
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
  };

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    getVideos();
  }, [debounceSearch]);

  const getVideos = async () => {
    setLoading(true);
    const params = {
      page: offset,
      per_page: perPageVideo,
      search: debounceSearch,
    };
    try {
      const { data } = await getVideoList(params);
      if (data?.success) {
        // console.log("data?.has_more", params, offset, data?.has_more);
        setVideoData([...videoData, ...data?.data]);
        setIsAvailable(data?.has_more);
        setOffset(offset + 1);
        setIsFetching(false);
        LoadingOverlay.hide();
        setLoading(false);
      } else {
        setLoading(false);
        LoadingOverlay.hide();
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
      }
    } catch (err) {
      LoadingOverlay.hide();
      setLoading(false);
    }
    LoadingOverlay.hide();
    setLoading(false);
  };

  const listEmptyData = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>There is no data to display</Text>
        {!loading && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.emptyTouch}
            onPress={() => {
              LoadingOverlay.show("Loading...");
              getVideos();
            }}
          >
            <Text style={styles.tryAgainText}>Try Again?</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItems = (item) => {
    return (
      <VideoCard
        item={item}
        onVideoPress={(itemDetail) => getVideoDetail(itemDetail)}
      />
    );
  };

  const renderFooterData = () => {
    return loading && <ActivityIndicator size={"small"} color={COLORS.white} />;
  };

  const loadMoreData = () => {
    if (isAvailable) {
      setIsFetching(true);
      setLoading(true);
      getVideos();
    } else {
      setIsFetching(false);
      setLoading(false);
    }
  };

  // Calculation of scrollview end
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[1]}
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={loadMoreData} />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            isAvailable && getVideos();
          }
        }}
        scrollEventThrottle={16}
      >
        <AppHeader
          onPressProfile={() => props?.navigation?.navigate("Profile")}
        />

        <SearchHeader searchData={searchValue} searchHandler={getSearchValue} />
        <FlashList
          estimatedItemSize={100}
          data={videoData}
          showsVerticalSc
          rollIndicator={false}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => renderItems(item)}
          ListEmptyComponent={listEmptyData}
          ListFooterComponent={renderFooterData}
          onEndReachedThreshold={0.5}
          // onEndReached={() => {
          //   console.log("on end ");
          //   isAvailable && getVideos();
          // }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  emptyContainer: {
    height: Dimensions.get("screen").height - hp(36),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: "OpenSans-Medium",
  },
  emptyTouch: {
    marginTop: hp(2),
    padding: hp(1),
    borderRadius: hp(1),
    backgroundColor: COLORS.white,
  },
  tryAgainText: {
    color: COLORS.black,
    fontFamily: "OpenSans-Medium",
    fontSize: hp(2),
  },
});

export default Home;
