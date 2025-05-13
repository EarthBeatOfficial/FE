import { Text } from "react-native";
import styled from "styled-components/native";

// constants
import { colors } from "../constants/colors";

interface SelecterProps {
  selected: boolean;
}

const Selector = (props: any) => {
  const { distance, time } = props.data;
  const { selected, onPress } = props;

  return (
    <Container onPress={() => onPress(distance)} selected={selected}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: selected ? "Poppins_700Bold" : "Poppins_400Regular",
          color: selected ? colors.green.main : colors.text.gray,
        }}
      >
        {distance && distance + `km`} {time}
      </Text>
    </Container>
  );
};

export default Selector;

const Container = styled.Pressable<SelecterProps>`
  border: 2px solid
    ${(props: any) => (props.selected ? colors.green.main : colors.border)};
  border-radius: 30px;
  max-height: 30px;
  padding: 5px;
  min-width: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  max-width: 160px;
  background-color: ${(props: any) => props.selected && colors.green.light};
`;
