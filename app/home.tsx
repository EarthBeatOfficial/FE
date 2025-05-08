import { useRouter } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";

// comps
import GlobalButton from "@/components/GlobalButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import BottomSheetModal from "../components/BottomSheetModal";
import ModalSection from "../components/ModalSection";
import Selector from "../components/Selector";
import ThemeCard from "../components/themeCard";

// constants
import walkThemes from "@/constants/walkThemes";
import NameCard from "../components/NameCard";
import { ThemedText } from "../components/ThemedText";
import { colors } from "../constants/colors";
import distanceData from "../constants/distanceData";

// icons / images
import MainHelpIcon from "../assets/icons/main-help.png";
import LogoImage from "../assets/images/logo-earth.png";
import LogoText from "../assets/images/logo-text.png";
import GlobalInput from "../components/GlobalInput";

export default function HomeScreen() {
  const router = useRouter();
  const [trailData, setTrailData] = useState({
    distance: null,
    theme: {
      id: null,
      title: "",
      emoji: "",
      color: {},
    },
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleSetTrailData = (key: string, value: any) => {
    setTrailData({
      ...trailData,
      [key]: value,
    });
  };

  const generateWalkTrail = () => {
    router.push("/map");
  };

  // set dummy data for now
  const name = "gahee";
  const numResponds = 8;

  const today = moment().format("MMMM Do");
  const day = moment().format("dddd");

  //   console.log(!trailData?.distance);

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
          <NameCard name={name} numResponds={numResponds} />
          <ThemedText style={{ marginBottom: -10 }}>
            Walking Distance
          </ThemedText>
          <FlexContainer
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
          </FlexContainer>
          <ThemedText style={{ marginBottom: -10 }}>
            Walking Trail Themes
          </ThemedText>
          <FlexContainer
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
                  selected={trailData?.theme?.id === theme.id}
                  onPress={() => {
                    handleSetTrailData("theme", theme);
                  }}
                />
              );
            })}
          </FlexContainer>
          <GlobalButton
            text="Start Walking"
            onPress={() => generateWalkTrail()}
            disabled={trailData?.distance === null || !trailData?.theme.id}
          />
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <ThemedText style={{ fontSize: 25, color: colors.green.main }}>
              Today, {today}
            </ThemedText>
            <ThemedText type="light" style={{ color: colors.text.gray }}>
              {day}
            </ThemedText>
          </View>
          <ListContainer>
            <ThemedText
              style={{
                color: colors.green.main,
                textAlign: "center",
                fontSize: 20,
              }}
            >
              There are no walks / signals
              <br />
              to display for today.
            </ThemedText>
          </ListContainer>
        </ParallaxScrollView>
      </ScrollViewContainer>

      <BottomSheetModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        height={800}
        isCancelButton
        isHeader
        headerTitle="Help Signal"
      >
        <ModalSection>
          <GlobalInput placeholder="Title (i.e. Please water my plant!)" />
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
          </View>
        </ModalSection>
        <ModalSection>
          <GlobalInput placeholder="Street Address" />
          <GlobalInput placeholder="Apartment, Suite, etc." />
          <GlobalInput placeholder="City" />
          <GlobalInput placeholder="Postal Code" />
        </ModalSection>
      </BottomSheetModal>

      {!isVisible && (
        <ButtonBox>
          <HelpButton onPress={() => setIsVisible(true)}>
            <Image
              source={MainHelpIcon}
              style={{ width: 76, height: 76, resizeMode: "contain" }}
            />
          </HelpButton>
        </ButtonBox>
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

const FlexContainer = styled.ScrollView`
  flex-direction: row;
  background-color: #fff;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.06));
  padding: 12px 15px;
  border-radius: 10px;
`;

const ButtonBox = styled.View`
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 1000;
`;

const HelpButton = styled.Pressable`
  background-color: ${colors.green.main};
  border-radius: 50%;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));
`;

const ListContainer = styled.View`
  background-color: #fff;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.06));
  padding: 15px;
  border-radius: 10px;
`;
