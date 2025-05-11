import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// comps
import GlobalButton from "@/components/GlobalButton";
import { ThemedText } from "@/components/ThemedText";
import GlobalInput from "../components/GlobalInput";
import LoadingModal from "../components/modals/LoadingModal";

// icons / constants
import logo from "../assets/images/earth-beat-logo.png";
import { colors } from "../constants/colors";

// API
import { createUser } from "@/api/userApi";

export default function NicknameScreen() {
  const [nickname, setNickname] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    setErrorState(false);

    try {
      const response = await createUser({ username: nickname });
      // Store user data in AsyncStorage
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          userId: response.id,
          nickname: response.username,
        })
      );
      // Navigate to home screen
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Handle duplicate nickname error
        setErrorState(true);
      } else {
        // Handle other errors
        console.error("Error creating user:", error);
      }
    } finally {
      setIsLoading(false);
      router.push("/home");
    }
  };

  return (
    <>
      {isLoading && <LoadingModal message={`Welcoming ${nickname}...`} />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={["#D3F36B", "#FFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  gap: 20,
                  width: "100%",
                  maxWidth: 400,
                  paddingHorizontal: 20,
                }}
              >
                <Image
                  source={logo}
                  style={{
                    width: 280,
                    height: 355,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
                <ThemedText
                  type="bold"
                  style={{ fontSize: 25, textAlign: "center" }}
                >
                  What should we call you?
                </ThemedText>
                {errorState ? (
                  <ThemedText
                    style={{
                      textAlign: "center",
                      color: colors.red.main,
                      fontSize: 18,
                    }}
                  >
                    This nickname already exists.
                    {"\n"}
                    Please enter a unique nickname
                  </ThemedText>
                ) : (
                  <ThemedText
                    style={{
                      textAlign: "center",
                      color: colors.text.gray,
                      fontSize: 18,
                    }}
                  >
                    Please provide a unique nickname
                  </ThemedText>
                )}
                <GlobalInput
                  value={nickname}
                  onChangeText={(text) => {
                    setNickname(text);
                    if (errorState) setErrorState(false);
                  }}
                  placeholder="Nickname"
                  isError={errorState}
                  multiline={false}
                  numberOfLines={1}
                />
                <GlobalButton
                  text="Get Started"
                  onPress={handleContinue}
                  disabled={!nickname.trim() || errorState || isLoading}
                />
              </View>
            </ScrollView>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
