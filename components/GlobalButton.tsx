import styled from "styled-components";
import { View, Button } from "react-native";
// ** find an alternative library for UI components

const GlobalButton = (props: any) => {
  return (
    <>
      <StyledButton {...props} />
    </>
  );
};

export default GlobalButton;

const StyledButton = styled(Button)`
  font-family: "Poppins_700Bold";
`;
