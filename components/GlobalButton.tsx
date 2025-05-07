import React from "react";
import { Button } from "react-native-paper";

import { colors } from "../constants/colors";

const GlobalButton = (props: any) => {
  const { text, disabled, icon, size } = props;

  return (
    <>
      <Button
        {...props}
        mode="contained"
        labelStyle={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}
        style={{
          borderRadius: icon ? "50%" : 10,
          backgroundColor: disabled
            ? "rgba(95, 95, 99, 0.3)"
            : colors.green.main,
          color: disabled ? colors.darkGray.main : "#fff",
          minHeight: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: icon && size && `${size}px`,
          height: icon && size && `${size}px`,
          padding: 0,
        }}
      >
        {text}
      </Button>
    </>
  );
};

export default GlobalButton;
