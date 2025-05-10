import React from "react";
import { Image, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { colors } from "../constants/colors";

interface GlobalButtonProps {
  text?: string;
  disabled?: boolean;
  icon?: any;
  size?: number;
  iconSource?: any;
  onPress?: () => void;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
  text,
  disabled,
  icon,
  size,
  iconSource,
  onPress,
  ...props
}) => {
  return (
    <Button
      {...props}
      mode="contained"
      onPress={onPress}
      labelStyle={styles.label}
      style={[
        styles.button,
        iconSource && styles.iconButton,
        iconSource && size && { width: size, height: size },
        disabled && styles.disabled,
      ]}
    >
      {iconSource ? <Image source={iconSource} style={styles.icon} /> : text}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: colors.green.main,
    minHeight: Platform.OS === "web" ? 48 : 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  iconButton: {
    borderRadius: 50,
  },
  disabled: {
    backgroundColor: "rgba(95, 95, 99, 0.3)",
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default GlobalButton;
