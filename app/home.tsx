import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

// comps
import GlobalButton from "@/components/GlobalButton";
import LoadingModal from "@/components/modals/LoadingModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import GlobalInput from "../components/GlobalInput";
import InfoTooltip from "../components/InfoTooltip";
import AutoCompleteModal from "../components/modals/AutoCompleteModal";
import BottomSheetModal from "../components/modals/BottomSheetModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import ModalSection from "../components/modals/ModalSection";
import NotificationModal from "../components/modals/NotificationModal";
import NameCard from "../components/NameCard";
import Selector from "../components/Selector";
import SignalIcon from "../components/SignalIcon";
import ThemeCard from "../components/themeCard";
import { ThemedText } from "../components/ThemedText";
import ThemeIcon from "../components/ThemeIcon";
import TimePicker from "../components/TimePicker";

// constants
import walkThemes from "@/constants/walkThemes";
import { colors } from "../constants/colors";
import distanceData from "../constants/distanceData";
import { WalkLog } from "../constants/interfaces";
import signalTypes from "../constants/signalTypes";

// icons / images
import MainHelpIcon from "@/assets/icons/main-help.png";
import LogoImage from "@/assets/images/logo-earth.png";
import LogoText from "@/assets/images/logo-text.png";

// Redux
import { setRecommendedRoute } from "@/redux/routeSlice";
import { useDispatch } from "react-redux";

// API
import { getAutoCompleteSet, getPlaceDetail } from "@/api/autocompleteApi";
import { getResponses, markResponseAsRead } from "@/api/responsesApi";
import { recommendRoute } from "@/api/routesApi";
import { createSignal } from "@/api/signalApi";
import { getWalkLogNum, getWalkLogs } from "@/api/walkLogApi";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);
  const [numResponds, setNumResponds] = useState(0);
  const [walkLogs, setWalkLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState<
    [{ message: string; id: number; signal: { title: string } }]
  >([{ message: "", id: 0, signal: { title: "" } }]);
  const [isPanEnabled, setIsPanEnabled] = useState(true);

  // useStates to handle route recommendation
  const [trailData, setTrailData] = useState({
    distance: 0,
    themeId: null,
    location: "",
  });
  const [isDistanceSelected, setIsDistanceSelected] = useState(false);

  // useStates to handle signal creation
  const [signalData, setSignalData] = useState({
    title: "",
    description: "",
    lat: null,
    lng: null,
    timeLimit: 10, // default 10 minutes
    categoryId: null,
  });
  const [placeSuggestions, setPlaceSuggestions] = useState([]);

  // useStates to handle modals
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = moment().format("MMMM Do");
  const day = moment().format("dddd");

  const fetchPlaceSuggestions = async (input: string) => {
    try {
      const response = await getAutoCompleteSet(input);
      setPlaceSuggestions(response.predictions);
    } catch (err) {
      console.error("Error fetching Google Places:", err);
    }
  };

  const handleSignalData = async (value: any, key: string) => {
    if (key === "location") {
      setSignalData({
        ...signalData,
        lat: value.lat,
        lng: value.lng,
      });
    } else {
      setSignalData({
        ...signalData,
        [key]: value,
      });
    }
  };

  const handleSelect = async (placeId: string) => {
    const res = await getPlaceDetail(placeId);
    if (res.location) {
      setSignalData({
        ...signalData,
        lat: res.location.lat,
        lng: res.location.lng,
      });
    }
  };

  const handleSetTrailData = (key: string, value: any) => {
    setTrailData({
      ...trailData,
      [key]: value,
    });
  };

  const handleTimeSelect = (minutes: number) => {
    handleSignalData(minutes, "timeLimit");
  };

  const generateSignal = async () => {
    try {
      const response = await createSignal({
        ...signalData,
        userId: userData?.userId,
      });
      // store in redux?

      // Close the modal
      setShowAddSignal(false);
    } catch (error) {
      console.error("Error creating signal:", error);
    } finally {
      setShowConfirmModal(true);
    }
  };

  const generateWalkTrail = async () => {
    setIsLoading(true);
    try {
      const resp = await recommendRoute({
        userId: userData?.userId,
        location: trailData?.location,
        themeId: trailData?.themeId,
        distance: trailData?.distance,
      });
      // Store trailData in redux to use it in a modal in map.tsx
      dispatch(setRecommendedRoute(resp));
    } catch (error: any) {
      console.log("Error generating a route recommendation", error);
    } finally {
      setIsLoading(false);
      router.push("/map");
    }

    if (trailData?.location) {
    } else {
      // ADD could not generate UI
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        const { latitude, longitude } = location.coords;
        setTrailData({
          ...trailData,
          location: `{\"latitude\": ${latitude}, \"longitude\": ${longitude}}`,
        });
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    }

    getCurrentLocation();
    fetchUserData();
  }, []);

  const WALKLOG_TEST_DATA = [
    {
      distance: 1.5,
      walkedAt: "2025-05-14T15:30:00Z",
      theme: {
        id: 1,
        name: "Nature-focused Walk",
      },
      respondedSignals: [
        {
          title: "Please help water my plant",
          description: "I have an ~~~",
          categoryId: 1,
          category: "Water Plants / Plant - Related",
          respondedAt: "2025-05-14T15:35:00Z",
        },
      ],
    },
    {
      distance: 1.5,
      walkedAt: "2025-05-14T15:30:00Z",
      theme: {
        id: 3,
        name: "Pet-based Walk",
      },
      respondedSignals: [
        {
          title: "Please help water my plant",
          description: "I have an ~~~",
          categoryId: 1,
          category: "Water Plants / Plant - Related",
          respondedAt: "2025-05-14T15:35:00Z",
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchWalkLogData() {
      if (userData && userData?.userId) {
        try {
          const todaysDate = moment().format();
          const numWalkLogs = await getWalkLogNum(userData?.userId);
          setNumResponds(numWalkLogs);
          const walkLogs = await getWalkLogs(userData?.userId);
          if (walkLogs?.length > 0) {
            const todaysLogs = walkLogs.find(
              (log: any) =>
                log.walkedAt.slice(0, 10) === todaysDate.slice(0, 10)
            );
            setWalkLogs(todaysLogs);
          }
        } catch (error) {
          console.error("Error fetching walk log data:", error);
        }
      }
    }
    async function fetchResponseData() {
      if (userData && userData?.userId) {
        try {
          const respData = await getResponses(userData?.userId);
          if (respData) {
            setResponseData(respData);
            if (respData.length > 0) {
              setShowNotification(true);
            }
          }
        } catch (error) {
          console.error("Error fetching response data:", error);
        }
      }
    }
    fetchWalkLogData();
    fetchResponseData();
  }, [userData]);

  const markAsRead = async (responseId: number) => {
    try {
      const data = await markResponseAsRead({ responseId: responseId });
      console.log(data);
    } catch (error) {
      console.log("Error marking response as read", error);
    } finally {
      //   setShowNotification(false);
    }
  };

  const TEST_DATA = {
    id: 3,
    userId: 1,
    categoryId: 5,
    title: "Help needed with recycling",
    description: "Need help sorting recyclables at the community center",
    lat: 37.5665,
    lng: 126.978,
    createdAt: "2025-05-12T21:12:04.142Z",
    timeLimit: 30,
    status: "IN_PROGRESS",
    selectedUserId: 5,
    expiresAt: "2025-05-12T21:42:04.142Z",
  };

  const testingRoute = {
    distance: 1.5,
    location:
      '{"latitude": 37.585217458447744, "longitude": 127.02856845626475}',
    themeId: 2,
    userId: 26,
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <ParallaxScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Image
              source={LogoImage}
              style={{ width: 35, height: 45, resizeMode: "contain" }}
            />
            <Image
              source={LogoText}
              style={{ width: 186, height: 22, resizeMode: "contain" }}
            />
          </View>
          <NameCard name={userData?.nickname} numResponds={numResponds} />
          <ThemedText style={{ marginBottom: -10 }}>
            Walking Distance
          </ThemedText>
          <View style={styles.flexContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 5,
              }}
            >
              {distanceData.map((data, key) => {
                return (
                  <Selector
                    data={data}
                    key={key}
                    selected={trailData?.distance === data.distance}
                    onPress={(distance: any) => {
                      handleSetTrailData("distance", distance);
                      setIsDistanceSelected(true);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
          <ThemedText style={{ marginBottom: -10 }}>
            Walking Trail Themes
          </ThemedText>
          <View style={styles.flexContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 5,
              }}
            >
              {walkThemes.map((theme, key) => {
                return (
                  <ThemeCard
                    disabled={!isDistanceSelected}
                    theme={theme}
                    key={key}
                    selected={trailData?.themeId === theme.id}
                    onPress={() => {
                      handleSetTrailData("themeId", theme.id);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
          <GlobalButton
            text="Start Walking"
            onPress={() => generateWalkTrail()}
            disabled={!isDistanceSelected || !trailData?.themeId}
          />
          {walkLogs?.length !== 0 && (
            <>
              <View style={styles.listItems}>
                <ThemedText style={{ fontSize: 18, color: colors.green.main }}>
                  Today, {today}
                </ThemedText>
                <ThemedText
                  type="light"
                  style={{ color: colors.text.gray, fontSize: 12 }}
                >
                  {day}
                </ThemedText>
              </View>
              <ScrollView style={styles.listContainer}>
                {walkLogs?.length !== 0 &&
                  walkLogs?.map((log: WalkLog) => {
                    const { id, name } = log.theme;
                    return (
                      <>
                        <View style={{ paddingBottom: 15 }}>
                          <View style={styles.listItems}>
                            <ThemeIcon themeId={id} />
                            <ThemedText>
                              {name} - {log.distance}km
                            </ThemedText>
                          </View>
                          {log.respondedSignals?.length > 0 &&
                            log.respondedSignals.map((item, key) => {
                              const { title, description } = item;
                              const category = signalTypes.find(
                                (sig) => sig.id === item.categoryId
                              );
                              return (
                                <View style={{ marginLeft: 50 }}>
                                  <View style={styles.listItems}>
                                    <SignalIcon
                                      key={key}
                                      signal={category}
                                      size={25}
                                      imgSize={18}
                                    />
                                    <ThemedText
                                      style={{
                                        color: colors.darkGray.main,
                                        fontSize: 12,
                                      }}
                                    >
                                      {title}
                                    </ThemedText>
                                  </View>
                                  <ThemedText
                                    style={{
                                      color: colors.text.gray,
                                      fontSize: 10,
                                      marginLeft: 35,
                                    }}
                                  >
                                    {description}
                                  </ThemedText>
                                </View>
                              );
                            })}
                        </View>
                      </>
                    );
                  })}
              </ScrollView>
            </>
          )}
        </ParallaxScrollView>
      </View>

      <BottomSheetModal
        isVisible={showAddSignal}
        onClose={() => setShowAddSignal(false)}
        height={630}
        isCancelButton
        isHeader
        headerTitle="Help Signal"
        isPanEnabled={isPanEnabled}
        onPressAction={generateSignal}
        disabled={
          signalData.title === "" ||
          signalData.description === "" ||
          !signalData.lat ||
          !signalData.lng ||
          !signalData.categoryId
        }
      >
        <ModalSection style={{ marginBottom: 16 }}>
          <GlobalInput
            placeholder="Title (i.e. Please water my plant!)"
            onChangeText={(value) => handleSignalData(value, "title")}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <ThemedText style={{ color: colors.darkGray.main }}>
              Categories
            </ThemedText>
            <InfoTooltip onOpen={() => setIsPanEnabled((state) => !state)} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {signalTypes.map((signal, key) => {
              return (
                <SignalIcon
                  signal={signal}
                  key={key}
                  selected={signalData?.categoryId === signal.id}
                  onPress={() => handleSignalData(signal.id, "categoryId")}
                />
              );
            })}
          </View>
          <GlobalInput
            placeholder="Description"
            //   multiline
            numberOfLines={3}
            onChangeText={(value) => handleSignalData(value, "description")}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <ThemedText style={{ color: colors.darkGray.main }}>
              Time Limit
            </ThemedText>
            <TimePicker
              onTimeSelect={handleTimeSelect}
              initialTime={signalData.timeLimit}
              onOpen={() => setIsPanEnabled((state) => !state)}
            />
          </View>
        </ModalSection>
        <ModalSection style={{ marginBottom: 16 }}>
          <AutoCompleteModal
            fetchSuggestions={fetchPlaceSuggestions}
            suggestions={placeSuggestions}
            onSelect={(placeId) => handleSelect(placeId)}
            //   onOpen={() => setIsPanEnabled((state) => !state)}
          />
        </ModalSection>
      </BottomSheetModal>

      {/* ------------- Add Signal Button -------------- */}
      {!showAddSignal && !showNotification && !showConfirmModal && (
        <View style={styles.buttonBox}>
          <Pressable
            onPress={() => setShowAddSignal(true)}
            style={styles.helpButton}
          >
            <Image
              source={MainHelpIcon}
              style={{ width: 56, height: 56, resizeMode: "contain" }}
            />
          </Pressable>
        </View>
      )}

      {/* ------------- Popup for when someone completes a signal -------------- */}
      <NotificationModal
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        responseData={responseData}
        onButtonPress={markAsRead}
      />

      {isLoading && (
        <LoadingModal
          message={`Generating a walk trail based on your selection...`}
        />
      )}
      <ConfirmModal
        signalTitle={signalData?.title}
        isVisible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />

      {/* testing - Accept*/}
      {/* <SignalModal
          isAccept
          onClose={() => setShowNotification(false)}
          data={TEST_DATA}
          buttonText={"Accept"}
          onPress={(id) => console.log(id)}
        /> */}
      {/* testing - Mark as responded*/}
      {/* <SignalModal
          isAccept={false}
          onClose={() => setShowNotification(false)}
          data={TEST_DATA}
          buttonText={"Mark as Responded"}
          onPress={(id)
           => console.log(id)}
        /> */}
      {/* testing - Take Route */}
      {/* <RouteModal
          themeId={testingRoute?.themeId}
          distance={testingRoute?.distance}
          onPress={() => console.log("clicked")}
        /> */}
      {/* testing - Show Signal on Map */}
      {/* <SignalMapModal
          data={TEST_DATA}
          onCancel={(id) => console.log(id)}
          onRespond={(id) => console.log(id)}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  flexContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 5,
  },
  listContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  helpButton: {
    backgroundColor: colors.green.main,
    borderRadius: "50%",
    width: 65,
    height: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  messageBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    flexDirection: "column",
    width: "100%",
    padding: 15,
  },
  message: {
    color: colors.darkGray.main,
    fontSize: 16,
  },
  buttonBox: {
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 1000,
  },
  listItems: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
