import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { ThemedText } from "../ThemedText";

interface LoadingModalProps {
  message?: string;
}

const LoadingModal = ({ message }: LoadingModalProps) => {
  return (
    <>
      <Modal>
        {/* <View style={styles.overlay}> */}
        <View style={styles.container}>
          <View style={styles.content}>
            <ActivityIndicator size="large" color={colors.green.main} />
            <ThemedText type="semiBold" style={{ color: colors.green.main }}>
              {message}
            </ThemedText>
          </View>
        </View>
        {/* </View> */}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
});

export default LoadingModal;
