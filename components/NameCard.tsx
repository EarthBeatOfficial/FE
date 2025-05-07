import { Image } from "react-native";
import styled from "styled-components/native";

import UserImage from "../assets/images/user-head.png";
import { colors } from "../constants/colors";
import { ThemedText } from "./ThemedText";

const NameCard = (props: any) => {
  const { name, numResponds } = props;
  return (
    <>
      <Container>
        <FlexBox>
          <Image
            source={UserImage}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              marginRight: 10,
            }}
          />
          <ThemedText style={{ textTransform: "uppercase", fontSize: 30 }}>
            {name}
          </ThemedText>
        </FlexBox>
        <FlexBox>
          <ThemedText
            type="bold"
            style={{ fontSize: 25, color: colors.green.main, marginRight: 5 }}
          >
            {numResponds}
          </ThemedText>
          <ThemedText style={{ fontSize: 20 }}>responds</ThemedText>
        </FlexBox>
      </Container>
    </>
  );
};

export default NameCard;

const Container = styled.View`
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.06));
  padding: 12px 15px;
  border-radius: 10px;
`;

const FlexBox = styled.View`
  flex-direction: row;
  align-items: center;
`;
