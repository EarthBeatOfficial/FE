import { Text } from "react-native";
import styled from "styled-components";
import { colors } from "../constants/colors";

interface ThemeCardProps {
  selected: boolean;
  color: { main: ""; light: "" };
}

const ThemeCard = (props: any) => {
  const theme = props.theme;
  const { selected, onClick } = props;

  return (
    <>
      <Container
        color={theme.color}
        onClick={() => onClick(theme.id)}
        selected={selected}
      >
        <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold" }}>
          {theme.emoji}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins_600SemiBold",
            color: theme.color.main,
          }}
        >
          {theme.title}
        </Text>
      </Container>
    </>
  );
};

export default ThemeCard;

const Container = styled.div<ThemeCardProps>`
  display: flex;
  flex-direction: column;
  width: 128px;
  height: 110px;
  /* max-height: 100px; */
  padding: 15px;
  background-color: ${(props) =>
    props.color ? props.color.light : colors.green.light};
  border: ${(props) => props.selected && `2px solid ${props.color.main}`};
  border-radius: 28px;
`;
