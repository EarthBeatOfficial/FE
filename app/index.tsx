import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image } from "react-native";

// comps / icons
import GlobalButton from "@/components/GlobalButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import logo from "../assets/images/earth-beat-logo.png";
import { colors } from "../constants/colors";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D3F36B", "#FFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Image
        source={logo}
        style={{ width: 315, height: 400, resizeMode: "contain" }}
      />
      <ThemedText type="bold" style={{ fontSize: 25 }}>
        Walk for the World
      </ThemedText>
      <ThemedText
        style={{ width: 365, textAlign: "center", color: colors.text.gray }}
      >
        We aim to help the world become a better place by providing a platform
        for the community members to help each other out while taking themed
        walks!
      </ThemedText>
      <GlobalButton
        icon={() => <AntDesign name="arrowright" size={24} color="white" />}
        size={65}
        onPress={() => router.push("/nickname")}
      />
    </LinearGradient>
  );
}
