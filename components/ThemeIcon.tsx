import React from "react";
import { StyleSheet, View } from "react-native";
import walkThemes from "../constants/walkThemes";
import { ThemedText } from "./ThemedText";

type ThemeIconProps = {
  themeId: number;
};

const ThemeIcon = ({ themeId }: ThemeIconProps) => {
  const theme = walkThemes.find((item) => item.id === themeId);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme?.color.light,
        },
        styles.shadow,
      ]}
    >
      <ThemedText>{theme?.emoji}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35,
    borderRadius: "50%",
    opacity: 1,
  },

  shadow: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
});

export default ThemeIcon;
