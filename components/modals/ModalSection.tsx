import React from "react";
import { StyleSheet, View } from "react-native";

interface ModalSectionProps {
  children?: React.ReactNode;
  style?: any;
}

const ModalSection: React.FC<ModalSectionProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(161, 161, 161, 0.1)",
    borderRadius: 20,
    padding: 15,
    gap: 15,
  },
});

export default ModalSection;
