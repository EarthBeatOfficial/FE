import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "bold" | "semiBold" | "light";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "bold" ? styles.bold : undefined,
        type === "semiBold" ? styles.semiBold : undefined,
        type === "light" ? styles.light : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Poppins_400Regular",
  },
  semiBold: {
    fontFamily: "Poppins_600SemiBold",
  },
  bold: {
    fontFamily: "Poppins_700Bold",
  },
  light: {
    fontFamily: "Poppins_300Light",
  },
});
