import React from "react";
import { StyleSheet, View } from "react-native";

interface ContainerProps {
  children?: React.ReactNode;
}

const WhiteContainer = ({ children }: ContainerProps) => {
  return <View style={styles.container}>{children}</View>;
};

export default WhiteContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
