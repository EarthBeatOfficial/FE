import React from "react";
import { Image } from "react-native";
import { Button } from "react-native-paper";

import { colors } from "../constants/colors";

const GlobalButton = (props: any) => {
  const { text, disabled, icon, size, iconSource } = props;

  return (
    <>
      <Button
        {...props}
        mode="contained"
        labelStyle={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}
        style={{
          borderRadius: iconSource ? "50%" : 10,
          backgroundColor: disabled
            ? "rgba(95, 95, 99, 0.3)"
            : colors.green.main,
          color: disabled ? colors.darkGray.main : "#fff",
          minHeight: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: iconSource && size && `${size}px`,
          height: iconSource && size && `${size}px`,
          padding: 0,
        }}
      >
        {iconSource ? (
          <Image source={iconSource} style={{ width: 24, height: 24 }} />
        ) : (
          text
        )}
      </Button>
    </>
  );
};

export default GlobalButton;
