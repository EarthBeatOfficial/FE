import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { colors } from "../constants/colors";

interface GlobalInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  isError?: boolean;
}

const GlobalInput = ({
  value,
  onChangeText,
  placeholder,
  isError,
}: GlobalInputProps) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.input}
      placeholderTextColor="#AFAFAF"
      mode="outlined"
      outlineStyle={isError ? styles.errorOutline : styles.outline}
      contentStyle={isError ? styles.errorContent : styles.content}
      theme={{ roundness: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5, // for Android shadow
  },
  outline: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: "#AFAFAF",
  },
  errorOutline: {
    borderWidth: 1,
    borderColor: colors.red.main,
    borderRadius: 10,
  },
  errorContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: colors.red.main,
  },
});

export default GlobalInput;
