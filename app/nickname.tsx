import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";

export default function NicknameScreen() {
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your nickname:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Nickname"
      />
      <Button
        title="Get Started"
        onPress={() => router.push("/home")}
        // disabled={!nickname}
      />
    </View>
  );
}
