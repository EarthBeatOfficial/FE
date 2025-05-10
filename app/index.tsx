import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image } from "react-native";

// comps / icons
import ArrowLeft from "@/assets/icons/arrow-left.png";
import GlobalButton from "@/components/GlobalButton";
import { ThemedText } from "@/components/ThemedText";
import logo from "../assets/images/earth-beat-logo.png";
import { colors } from "../constants/colors";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D3F36B", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.8 }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <Image
        source={logo}
        style={{ width: 280, height: 355, resizeMode: "contain" }}
      />
      <ThemedText type="bold" style={{ fontSize: 25 }}>
        Walk for the World
      </ThemedText>
      <ThemedText
        style={{
          width: 300,
          textAlign: "center",
          color: colors.text.gray,
          fontSize: 18,
        }}
      >
        We aim to help the world become a better place by providing a platform
        for the community members to help each other out while taking themed
        walks!
      </ThemedText>
      <GlobalButton
        iconSource={ArrowLeft}
        size={65}
        onPress={() => router.push("/nickname")}
      />
    </LinearGradient>
  );
}
