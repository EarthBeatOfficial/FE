import { Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../constants/colors";

interface ThemeCardProps {
  selected?: boolean;
  color?: { main: string; light: string };
  disabled?: boolean;
  onPress?: (id: number) => void;
  theme: {
    id: number;
    title: string;
    emoji: string;
    color: { main: string; light: string };
  };
}

interface ContainerProps {
  color: { main: string; light: string };
  selected?: boolean;
  disabled?: boolean;
}

const ThemeCard = ({ theme, onPress, disabled, selected }: ThemeCardProps) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(theme.id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled}>
      <Container color={theme.color} selected={selected} disabled={disabled}>
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
    </TouchableOpacity>
  );
};

export default ThemeCard;

const Container = styled.View<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 128px;
  height: 110px;
  padding: 15px;
  background-color: ${(props: ContainerProps) =>
    props.disabled
      ? colors.darkGray.light
      : props.color
        ? props.color.light
        : colors.green.light};
  border: ${(props: ContainerProps) =>
    props.selected ? `2px solid ${props.color.main}` : "none"};
  border-radius: 28px;
  opacity: ${(props: ContainerProps) => (props.disabled ? 0.5 : 1)};
`;
