import React from "react";
import { Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { colors } from "../constants/colors";

interface GlobalButtonProps {
  text?: string;
  disabled?: boolean;
  icon?: any;
  size?: number;
  iconSource?: any;
  onPress?: () => void;
  color?: string;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
  text,
  disabled,
  icon,
  size,
  iconSource,
  onPress,
  color,
  ...props
}) => {
  return (
    <Button
      {...props}
      mode="contained"
      onPress={onPress}
      labelStyle={[styles.label, disabled && styles.disabledLabel]}
      disabled={disabled}
      style={[
        styles.button,
        iconSource && styles.iconButton,
        iconSource && size && { width: size, height: size },
        disabled && styles.disabled,
        color && { backgroundColor: color },
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
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    minWidth: 45,
  },
  iconButton: {
    borderRadius: "50%",
  },
  disabled: {
    backgroundColor: "rgba(95, 95, 99, 0.3)",
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  icon: {
    width: 20,
    height: 20,
  },
  disabledLabel: {
    color: colors.darkGray.main,
  },
});

export default GlobalButton;
