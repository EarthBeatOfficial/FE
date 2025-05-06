import { useState } from "react";
import { useRouter } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// comps
import GlobalButton from "@/components/GlobalButton";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <ThemedView>
        <ThemedText type="title">Walk for the World</ThemedText>
        <ThemedText>
          We aim to help the world become a better place by providing a platform
          for the community members to help each other out while taking themed
          walks!
        </ThemedText>
        <GlobalButton
          title="get started"
          onPress={() => router.push("/nickname")}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
