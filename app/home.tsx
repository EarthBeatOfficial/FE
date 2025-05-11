import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";

// comps
import GlobalButton from "@/components/GlobalButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import AutoCompleteModal from "../components/AutoCompleteModal";
import BottomSheetModal from "../components/BottomSheetModal";
import CountdownTimer from "../components/CountdownTimer";
import GlobalInput from "../components/GlobalInput";
import InfoTooltip from "../components/InfoTooltip";
import ModalSection from "../components/ModalSection";
import NameCard from "../components/NameCard";
import Selector from "../components/Selector";
import SignalIcon from "../components/SignalIcon";
import ThemeCard from "../components/themeCard";
import { ThemedText } from "../components/ThemedText";
import TimePicker from "../components/TimePicker";

// constants
import walkThemes from "@/constants/walkThemes";
import { colors } from "../constants/colors";
import distanceData from "../constants/distanceData";
import signalTypes from "../constants/signalTypes";

// icons / images
import MainHelpIcon from "@/assets/icons/main-help.png";
import LogoImage from "@/assets/images/logo-earth.png";
import LogoText from "@/assets/images/logo-text.png";
import SuccessIcon from "@/assets/images/success-hands.png";

// API / redux
import { recommendRoute } from "@/api/routesApi";
import { createSignal } from "@/api/signalApi";
import { getWalkLogNum, getWalkLogs } from "@/api/walkLogApi";
import { setRecommendedRoute } from "@/redux/routeSlice";
import { useDispatch } from "react-redux";

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
  const [trailData, setTrailData] = useState({
    distance: null,
    themeId: null,
    location: "",
  });
  const [responseData, setResponseData] = useState({ message: "", title: "" });
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [signalData, setSignalData] = useState({
    title: "",
    description: "",
    lat: null,
    lng: null,
    timeLimit: 10, // default 10 minutes
    categoryId: null,
  });
  const [route, setRoute] = useState();
  const [isPanEnabled, setIsPanEnabled] = useState(true);
  const [signalStartTime, setSignalStartTime] = useState<Date | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);

  const GOOOGLE_API_KEY = "AIzaSyAFdSqMPFP89HZa_bKh4v6GveO_TY4x4VI";

  const fetchPlaceSuggestions = async (input: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOOGLE_API_KEY}&language=en`
      );
      const json = await response.json();
      setPlaceSuggestions(json.predictions);
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
      //   try {
      //     const response = await fetch(
      //       `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOOGLE_API_KEY}&language=en`
      //     );
      //     const json = await response.json();
      //     setPlaceSuggestions(json.predictions);
      //   } catch (err) {
      //     console.error("Error fetching Google Places:", err);
      //   }
    } else {
      setSignalData({
        ...signalData,
        [key]: value,
      });
    }
  };

  console.log("signal", signalData);

  const handleSelect = async (placeId: string) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOOGLE_API_KEY}`
    );
    const json = await res.json();
    if (json.result.geometry.location) {
      setSignalData({
        ...signalData,
        lat: json.result.geometry.location.lat,
        lng: json.result.geometry.location.lng,
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

  const handleSignalSubmit = async () => {
    try {
      const response = await createSignal({
        ...signalData,
        userId: userData?.userId,
      });
      // store in redux?
      console.log(response);

      // Set the start time when the signal is created
      setSignalStartTime(new Date());

      // Close the modal
      setShowAddSignal(false);
    } catch (error) {
      console.error("Error creating signal:", error);
    }
  };

  const generateWalkTrail = async () => {
    try {
      const resp = await recommendRoute({
        userId: userData?.userId,
        location: trailData?.location,
        themeId: trailData?.themeId,
        distance: trailData?.distance,
      });
      dispatch(setRecommendedRoute(resp));
      router.push("/map");
    } catch (error: any) {
      console.log("Error generating a route recommendation", error);
    }

    if (trailData?.location) {
    } else {
      // ADD could not generate UI
    }
  };

  const today = moment().format("MMMM Do");
  const day = moment().format("dddd");

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
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        const { latitude, longitude } = location.coords;
        setTrailData({
          ...trailData,
          location: `{\"latitude\": ${latitude}, \"longitude\": ${longitude}}`,
        });
      }
    }

    getCurrentLocation();
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchWalkLongData = async () => {
      if (userData && userData?.userId) {
        try {
          const numWalkLogs = await getWalkLogNum(userData?.userId);
          setNumResponds(numWalkLogs);
          const walkLogs = await getWalkLogs(userData?.userId);
          setWalkLogs(walkLogs);
        } catch (error) {
          console.error("Error fetching walk log data:", error);
        }
      }
    };
    fetchWalkLongData();
  }, [userData]);

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   style={{ flex: 1 }}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
    // >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.container}>
          <ParallaxScrollView>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={LogoImage}
                style={{ width: 45, height: 56, resizeMode: "contain" }}
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
                      onPress={(distance: any) =>
                        handleSetTrailData("distance", distance)
                      }
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
                      disabled={trailData?.distance === null}
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
              disabled={trailData?.distance === null || !trailData?.themeId}
            />
            {walkLogs?.length !== 0 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <ThemedText
                    style={{ fontSize: 25, color: colors.green.main }}
                  >
                    Today, {today}
                  </ThemedText>
                  <ThemedText type="light" style={{ color: colors.text.gray }}>
                    {day}
                  </ThemedText>
                </View>
                <View style={styles.listContainer}></View>
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
          onPressAction={handleSignalSubmit}
          disabled={
            !signalData.categoryId &&
            !signalData.description &&
            !signalData.lat &&
            !signalData.lng &&
            !signalData.timeLimit &&
            !signalData.title
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
        {!showAddSignal && !showSuccessModal && (
          <ButtonBox>
            <Pressable
              onPress={() => setShowAddSignal(true)}
              style={styles.helpButton}
            >
              <Image
                source={MainHelpIcon}
                style={{ width: 56, height: 56, resizeMode: "contain" }}
              />
            </Pressable>
          </ButtonBox>
        )}

        {/* ------------- Popup for when someone completes a signal -------------- */}
        <BottomSheetModal
          isVisible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          height={550}
          isButton
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 15,
            }}
          >
            <Image source={SuccessIcon} style={{ width: 200, height: 200 }} />
            <ThemedText style={{ textAlign: "center", fontSize: 16 }}>
              A helpful responder{"\n"}
              just completed your signal
            </ThemedText>
            <ThemedText
              type="semiBold"
              style={{ color: colors.green.main, fontSize: 25 }}
            >
              {responseData?.title}
            </ThemedText>
            <View style={styles.messageBox}>
              <ThemedText style={styles.message}>
                Message from responder:
              </ThemedText>
              <ThemedText style={styles.message}>
                {responseData?.message}
                hello
              </ThemedText>
            </View>
          </View>
        </BottomSheetModal>

        {signalStartTime && (
          <CountdownTimer
            timeLimit={signalData.timeLimit}
            startTime={signalStartTime}
            onTimeUp={() => {
              // Handle when time is up
              console.log("Time limit reached!");
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
}

const ButtonBox = styled.View`
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 1000;
`;

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
});
