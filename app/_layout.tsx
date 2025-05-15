import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "../redux/store";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Appearance.setColorScheme("light");

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#E0E0E0",
      text: "#141415",
      // Add more overrides if needed
    },
  };

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_300Light,
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="nickname" options={{ headerShown: false }} />
          <Stack.Screen name="map" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </Provider>
  );
}

// const WALKLOG_TEST_DATA = 	[
//   {
//     "distance": 1.5,
//     "walkedAt": "2024-03-20T15:30:00Z",
//     "theme": {
//       "id": 1,
//       "name": "Nature-focused Walk"
//     },
//     "respondedSignals": [
//       {
//         "title": "Please help water my plant",
//         "description": "I have an ~~~",
//         "categoryId": 1,
//         "category": "Water Plants / Plant - Related",
//         "respondedAt": "2024-03-20T15:25:00Z"
//       }
//     ]
//   }
// ]
