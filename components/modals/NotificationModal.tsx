import SuccessIcon from "@/assets/images/success-hands.png";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import GlobalButton from "../GlobalButton";
import { ThemedText } from "../ThemedText";

interface NotificationModalProps {
  responseData: [{ message: string; id: number; signal: { title: string } }];
  isVisible: boolean;
  onButtonPress: (id: number) => void;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const NotificationModal = ({
  isVisible,
  responseData,
  onButtonPress,
  onClose,
}: NotificationModalProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [currentIndex, setCurrentIndex] = useState(0);

  const showModal = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isVisible) {
      showModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  const handleNext = () => {
    if (currentIndex < responseData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Modal transparent visible={isVisible}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 15,
              }}
              // key={key}
            >
              <Image source={SuccessIcon} style={{ width: 200, height: 200 }} />
              <ThemedText style={{ textAlign: "center", fontSize: 16 }}>
                A helpful responder{"\n"}
                just completed your signal
              </ThemedText>
              <ThemedText
                type="semiBold"
                style={{ color: colors.green.main, fontSize: 25 }}
              >
                {responseData[currentIndex]?.signal.title}
              </ThemedText>
              <ThemedText style={styles.message}>
                Message from responder:
              </ThemedText>
              <View style={styles.messageBox}>
                <ThemedText style={styles.message}>
                  {responseData[currentIndex]?.message}
                </ThemedText>
              </View>
              <View style={{ width: "100%" }}>
                <GlobalButton
                  text="Got it"
                  onPress={() => {
                    handleNext();
                    onButtonPress(responseData[currentIndex]?.id);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  messageBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    flexDirection: "column",
    width: "100%",
    padding: 15,
  },
  message: {
    color: colors.darkGray.main,
    fontSize: 16,
  },
});

export default NotificationModal;
