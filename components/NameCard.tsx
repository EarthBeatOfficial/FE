import { Image, StyleSheet, View } from "react-native";

import UserImage from "../assets/images/user-head.png";
import { colors } from "../constants/colors";
import { ThemedText } from "./ThemedText";

const NameCard = (props: any) => {
  const { name, numResponds } = props;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexBox}>
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
        </View>
        <View style={styles.flexBox}>
          <ThemedText
            type="bold"
            style={{ fontSize: 25, color: colors.green.main, marginRight: 5 }}
          >
            {numResponds}
          </ThemedText>
          <ThemedText style={{ fontSize: 20 }}>responds</ThemedText>
        </View>
      </View>
    </>
  );
};

export default NameCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
});
