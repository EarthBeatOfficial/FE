import { Text, Pressable } from "react-native";
import styled from "styled-components/native";
import { colors } from "../constants/colors";

interface ThemeCardProps {
  selected?: boolean;
  color: { main: ""; light: "" };
  disabled?: boolean;
}

const ThemeCard = (props: any) => {
  const theme = props.theme;
  const { onPress, disabled, selected } = props;

  // console.log("theme card:", selected, disabled);

  return (
    // <Pressable>
    <Container
      color={theme.color}
      onPress={() => {
        if (!disabled) onPress(theme.id);
        else {
          console.log(disabled);
        }
      }}
      {...props}
    >
      <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold" }}>
        {theme.emoji}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins_600SemiBold",
          color: disabled ? colors.darkGray.main : theme.color.main,
        }}
      >
        {theme.title}
      </Text>
    </Container>
    // </Pressable>
  );
};

export default ThemeCard;

const Container = styled.View<ThemeCardProps>`
  display: flex;
  flex-direction: column;
  width: 128px;
  height: 110px;
  /* max-height: 100px; */
  padding: 15px;
  background-color: ${(props: any) =>
    props.disabled
      ? colors.darkGray.light
      : props.color
        ? props.color.light
        : colors.green.light};
  border: ${(props: any) =>
    props.selected ? `2px solid ${props.color.main}` : "none"};
  border-radius: 28px;
`;
