import SuccessImage from "@/assets/images/success.png";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { ThemedText } from "../ThemedText";
import BottomSheetModal from "./BottomSheetModal";

interface ConfirmModalProps {
  message?: string;
  signalTitle?: string;
  onClose: () => void;
  isVisible: boolean;
}

const ConfirmModal = ({
  message,
  signalTitle,
  onClose,
  isVisible,
}: ConfirmModalProps) => {
  return (
    <>
      <BottomSheetModal
        isVisible={isVisible}
        onClose={onClose}
        height={signalTitle ? 320 : 280}
      >
        <View style={styles.content}>
          <Image source={SuccessImage} style={{ width: 135, height: 135 }} />
          {signalTitle ? (
            <>
              <View style={{ width: "80%" }}>
                <ThemedText style={{ textAlign: "center" }}>
                  The following signal has been successfully sent to responders:
                </ThemedText>
              </View>
              <ThemedText
                type="semiBold"
                style={{
                  color: colors.green.main,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {signalTitle}
              </ThemedText>
            </>
          ) : (
            <>
              <ThemedText
                type="semiBold"
                style={{
                  color: colors.green.main,
                  fontSize: 20,
                  //   width: "50%",
                  textAlign: "center",
                }}
              >
                {message}
              </ThemedText>
            </>
          )}
        </View>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

export default ConfirmModal;
