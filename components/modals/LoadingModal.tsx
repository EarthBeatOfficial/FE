import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { ThemedText } from "../ThemedText";

interface LoadingModalProps {
  message?: string;
  name?: string;
}

const LoadingModal = ({ message, name }: LoadingModalProps) => {
  return (
    <>
      <Modal>
        {/* <View style={styles.overlay}> */}
        <View style={styles.container}>
          <View style={styles.content}>
            <ActivityIndicator size="large" color={colors.green.main} />
            <ThemedText
              type="semiBold"
              style={{
                color: colors.green.main,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {message}
            </ThemedText>
            {name && (
              <ThemedText
                type="semiBold"
                style={{
                  color: colors.green.main,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {name}!
              </ThemedText>
            )}
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
    width: "50%",
  },
});

export default LoadingModal;
