import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import WarningImage from "@/assets/images/warning.png";
import { ThemedText } from "../components/ThemedText";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/home")}
        >
          {/* <Image source={ArrowIcon} style={{ width: 16, height: 16 }} /> */}
        </TouchableOpacity>
        <Image source={WarningImage} style={{ width: 200, height: 200 }} />
        <ThemedText
          type="semiBold"
          style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}
        >
          Oops!{"\n"}This page does not exist.
        </ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backBtn: {
    padding: 8,
    borderRadius: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
    left: 20,
  },
});
