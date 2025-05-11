import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

// comps
import GlobalButton from "@/components/GlobalButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
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
import InfoIcon from "@/assets/icons/info.png";
import MainHelpIcon from "@/assets/icons/main-help.png";
import LogoImage from "@/assets/images/logo-earth.png";
import LogoText from "@/assets/images/logo-text.png";
import SuccessIcon from "@/assets/images/success-hands.png";

// API
import { recommendRoute } from "@/api/routesApi";
import { getWalkLogNum, getWalkLogs } from "@/api/walkLogApi";

export default function HomeScreen() {
  const router = useRouter();
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
    location: { lat: "", long: "" },
  });
  const [responseData, setResponseData] = useState({ message: "", title: "" });
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // hard coded for now
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [signalData, setSignalData] = useState({
    categoryId: null,
    title: "",
    desc: "",
    streetAddress: "",
    aptAddress: "",
    city: "",
    postalCode: "",
    timeLimit: 10, // default 10 minutes
  });
  const [testData, setTestData] = useState();

  const [signalStartTime, setSignalStartTime] = useState<Date | null>(null);

  const handleSignalData = (value: any, key: string) => {
    setSignalData({
      ...signalData,
      [key]: value,
    });
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
      // Your POST request here
      // const response = await axios.post('/api/signals', signalData);

      // Set the start time when the signal is created
      setSignalStartTime(new Date());

      // Close the modal
      setShowAddSignal(false);
    } catch (error) {
      console.error("Error creating signal:", error);
    }
  };

  const generateWalkTrail = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      //   setTrailData({
      //     ...trailData,
      //     location: {
      //       lat: JSON.stringify(latitude),
      //       long: JSON.stringify(longitude),
      //     },
      //   });
      if (latitude && longitude) {
        try {
          const resp = await recommendRoute({
            userId: userData?.userId,
            location: `{\"latitude\": ${latitude}, \"longitude\": ${longitude}}`,
            themeId: trailData?.themeId,
            distance: trailData?.distance,
          });
          setTestData(resp);
          router.push("/map");
        } catch (error: any) {
          console.log("Error generating a route recommendation", error);
        }
      }
    });
    if (trailData?.location) {
    } else {
      // ADD could not generate UI
    }
  };

  // set dummy data for now, preferrably store these values in 1 object
  const walkLog = [];

  const today = moment().format("MMMM Do");
  const day = moment().format("dddd");
  const testTimeValue = new Date(1598051730000);

  useEffect(() => {
    const fetchUserData = async () => {
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
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchWalkLongData = async () => {
      try {
        const numWalkLogs = await getWalkLogNum(userData?.userId);
        setNumResponds(numWalkLogs);
        const walkLogs = await getWalkLogs(userData?.userId);
        setWalkLogs(walkLogs);
      } catch (error) {
        console.error("Error fetching walk long data:", error);
      }
    };
    fetchWalkLongData();
  }, [userData]);

  return (
    <Container>
      <ScrollViewContainer>
        <ParallaxScrollView>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 5,
            }}
            style={styles.flexContainer}
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
          <ThemedText style={{ marginBottom: -10 }}>
            Walking Trail Themes
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 5,
            }}
            style={styles.flexContainer}
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
          <GlobalButton
            text="Start Walking"
            onPress={() => generateWalkTrail()}
            disabled={trailData?.distance === null || !trailData?.themeId}
          />
          <ThemedText>{testData}</ThemedText>
          {walkLog?.length !== 0 && (
            <>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <ThemedText style={{ fontSize: 25, color: colors.green.main }}>
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
      </ScrollViewContainer>

      <BottomSheetModal
        isVisible={showAddSignal}
        onClose={() => setShowAddSignal(false)}
        height={830}
        isCancelButton
        isHeader
        headerTitle="Help Signal"
      >
        <ModalSection>
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
            <Pressable onPress={() => setShowTooltip((state) => !state)}>
              <Image source={InfoIcon} style={{ width: 20, height: 20 }} />
            </Pressable>
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
                  {...signal}
                  key={key}
                  selected={signalData?.categoryId === signal.id}
                  onPress={() => handleSignalData(signal.id, "categoryId")}
                />
              );
            })}
          </View>
          <GlobalInput
            placeholder="Description"
            multiline
            numberOfLines={3}
            onChangeText={(value) => handleSignalData(value, "desc")}
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
            />
          </View>
        </ModalSection>
        <ModalSection>
          <GlobalInput
            placeholder="Street Address"
            // autocomplete
            onChangeText={(value) => handleSignalData(value, "streetAddress")}
          />
          <GlobalInput
            placeholder="Apartment, Suite, etc."
            onChangeText={(value) => handleSignalData(value, "aptAddress")}
          />
          <GlobalInput
            placeholder="City"
            onChangeText={(value) => handleSignalData(value, "city")}
          />
          <GlobalInput
            placeholder="Postal Code"
            onChangeText={(value) => handleSignalData(value, "postalCode")}
          />
        </ModalSection>
      </BottomSheetModal>
      {showAddSignal && (
        <InfoTooltip
          isVisible={showTooltip}
          onClose={() => setShowTooltip(false)}
        />
      )}

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
        height={440}
        isButton
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 15 }}
        >
          <Image source={SuccessIcon} style={{ width: 200, height: 200 }} />
          <ThemedText style={{ textAlign: "center" }}>
            A helpful responder{"\n"}
            just completed your signal
          </ThemedText>
          <ThemedText type="bold" style={{ color: colors.green.main }}>
            {responseData?.title}
          </ThemedText>
          <View style={styles.messageBox}>
            <ThemedText>Message from responder:</ThemedText>
            <ThemedText></ThemedText>
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
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  height: 100%;
`;

const ScrollViewContainer = styled.View`
  flex: 1;
  height: 100%;
`;

const ButtonBox = styled.View`
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 1000;
`;

const styles = StyleSheet.create({
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
  },
});
