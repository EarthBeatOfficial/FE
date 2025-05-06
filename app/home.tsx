import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import styled from "styled-components";

// comps
import GlobalButton from "@/components/GlobalButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import Selector from "../components/Selector";
import ThemeCard from "../components/themeCard";

// constants
import walkThemes from "@/constants/walkThemes";
import distanceData from "../constants/distanceData";
import Typography from "../constants/typography";

export default function HomeScreen() {
  const router = useRouter();
  const [trailData, setTrailData] = useState({
    distance: 0,
    theme: {
      id: null,
      title: "",
      emoji: "",
      color: {},
    },
  });

  const handleSetTrailData = (key: string, value: any) => {
    setTrailData({
      ...trailData,
      [key]: value,
    });
  };

  const generateWalkTrail = () => {
    router.push("/map");
  };

  console.log(trailData);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <ThemedView>
        <Text style={Typography.h1}>Home page</Text>
      </ThemedView>
      <FlexContainer>
        {distanceData.map((data, key) => {
          return (
            <Selector
              data={data}
              key={key}
              selected={trailData?.distance === data.distance}
              onClick={(distance: any) =>
                // router.push({ pathname: "/map", params: distance })
                //   params 안 쓸 것 같지만 혹시 몰라서 놔두는 코드
                handleSetTrailData("distance", distance)
              }
            />
          );
        })}
      </FlexContainer>
      <FlexContainer>
        {walkThemes.map((theme, key) => {
          return (
            <ThemeCard
              theme={theme}
              key={key}
              selected={trailData?.theme?.id === theme.id}
              onClick={() => {
                handleSetTrailData("theme", theme);
              }}
            />
          );
        })}
      </FlexContainer>
      <GlobalButton title="start walking" onPress={() => generateWalkTrail()} />
    </ParallaxScrollView>
  );
}

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 5px;
  }
`;
