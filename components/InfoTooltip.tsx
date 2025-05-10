import { View } from "react-native";
import signalTypes from "../constants/signalTypes";
import SignalIcon from "./SignalIcon";
import { ThemedText } from "./ThemedText";

interface InfoToolTipProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoTooltip = ({ isVisible, onClose }: InfoToolTipProps) => {
  if (!isVisible) return null;

  return (
    // <Modal transparent animationType="fade">
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        width: 280,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        position: "absolute",
        top: 250,
        left: 80,
        gap: 10,
      }}
    >
      {signalTypes.map((signal, key) => {
        return (
          <View
            key={key}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <SignalIcon {...signal} size={40} imgSize={30} disabled key={key} />
            <ThemedText style={{ fontSize: 14 }}>{signal.title}</ThemedText>
          </View>
        );
      })}
    </View>
    // </Modal>
  );
};

export default InfoTooltip;
