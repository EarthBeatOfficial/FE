import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

// comps / icons
import GlobalButton from "@/components/GlobalButton";
import { ThemedText } from "@/components/ThemedText";
import logo from "../assets/images/earth-beat-logo.png";
import GlobalInput from "../components/GlobalInput";
import { colors } from "../constants/colors";

export default function NicknameScreen() {
  const [nickname, setNickname] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const router = useRouter();

  const isDuplicate = (name: string) =>
    ["alice", "bob"].includes(name.toLowerCase());

  useEffect(() => {
    if (nickname) {
      setDuplicate(isDuplicate(nickname));
      if (errorState) {
        setErrorState((state) => !state);
      }
    }
  }, [nickname]);

  const handleContinue = () => {
    if (duplicate) {
      setErrorState(true);
    } else {
      router.replace("/home");
      setErrorState(false);
    }
  };

  return (
    <LinearGradient
      colors={["#D3F36B", "#FFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.3 }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        width: "100%",
      }}
    >
      <View style={{ gap: 15 }}>
        <Image
          source={logo}
          style={{
            width: 315,
            height: 400,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <ThemedText type="bold" style={{ fontSize: 25, textAlign: "center" }}>
          What should we call you?
        </ThemedText>
        {errorState ? (
          <ThemedText
            style={{
              width: 365,
              textAlign: "center",
              color: colors.red.main,
            }}
          >
            This nickname already exists.
            <br />
            Please enter a unique nickname
          </ThemedText>
        ) : (
          <ThemedText
            style={{
              width: 365,
              textAlign: "center",
              color: colors.text.gray,
            }}
          >
            Please provide a unique nickname
          </ThemedText>
        )}
        <GlobalInput
          value={nickname}
          onChangeText={setNickname}
          placeholder="Nickname"
          isError={errorState}
        />
        <GlobalButton
          text="Get Started"
          onPress={() => handleContinue()}
          disabled={!nickname || errorState}
        />
      </View>
    </LinearGradient>
  );
}
