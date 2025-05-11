import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import signalTypes from "../constants/signalTypes";

// comps
import SignalIcon from "./SignalIcon";
import { ThemedText } from "./ThemedText";

// icons
import InfoIcon from "@/assets/icons/info.png";

interface InfoTooltipProps {
  onOpen: () => void;
}

const InfoTooltip = ({ onOpen }: InfoTooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          setShow(true);
          onOpen();
        }}
      >
        <Image source={InfoIcon} style={{ width: 20, height: 20 }} />
      </Pressable>
      <Modal visible={show} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            setShow(false);
            onOpen();
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 25,
              paddingVertical: 20,
              //   width: 280,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              // position: "absolute",
              // top: 230,
              // left: 80,
              gap: 10,
            }}
          >
            {signalTypes.map((signal, key) => {
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <SignalIcon
                    signal={signal}
                    size={40}
                    imgSize={30}
                    disabled
                    key={key}
                  />
                  <ThemedText style={{ fontSize: 14 }}>
                    {signal.title}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default InfoTooltip;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
});
