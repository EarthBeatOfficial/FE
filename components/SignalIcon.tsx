import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SignalType } from "../constants/signalTypes";

interface SignalIconProps {
  signal?: SignalType;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
  selected?: boolean;
  key: number;
  imgSize?: number;
  isShadow?: boolean;
}

const SignalIcon: React.FC<SignalIconProps> = ({
  size = 50, // default size
  disabled,
  onPress,
  selected = true, // true by default
  signal,
  imgSize,
  isShadow = false,
}) => {
  const IconContent = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: signal?.color,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: selected ? 1 : 0.5,
        },
        isShadow && styles.shadow,
      ]}
    >
      <Image
        source={signal?.image}
        style={[
          styles.image,
          {
            width: imgSize ? imgSize : 42,
            height: imgSize ? imgSize : 42,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );

  if (disabled) {
    return IconContent;
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      {IconContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // tintColor: "#fff", // makes the image white
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

export default SignalIcon;
