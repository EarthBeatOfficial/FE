import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface SignalIconProps {
  id: number;
  title: string;
  image: any;
  color: string;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
  imgSize?: number;
  selected?: boolean;
  key: number;
}

const SignalIcon: React.FC<SignalIconProps> = ({
  image,
  color,
  size = 56, // default size
  disabled,
  onPress,
  imgSize,
  selected = true, // true by default
}) => {
  const IconContent = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: selected ? 1 : 0.5,
        },
      ]}
    >
      <Image
        source={image}
        style={[
          styles.image,
          {
            width: imgSize ? imgSize : 50,
            height: imgSize ? imgSize : 50,
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
});

export default SignalIcon;
