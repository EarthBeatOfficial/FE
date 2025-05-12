import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import GlobalButton from "../GlobalButton";
import { ThemedText } from "../ThemedText";

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  height?: number;
  isHeader?: boolean;
  headerTitle?: string;
  isCancelButton?: boolean;
  onPressAction?: () => void;
  isButton?: boolean;
  isPanEnabled?: boolean;
  disabled?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.7;

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isVisible,
  onClose,
  children,
  height = DEFAULT_HEIGHT,
  isHeader,
  headerTitle,
  isCancelButton,
  onPressAction,
  isButton = false,
  isPanEnabled = true,
  disabled = true,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isPanEnabled,
      onMoveShouldSetPanResponder: () => isPanEnabled,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height * 0.3) {
          closeModal();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      showModal();
    }
  }, [isVisible]);

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
    }).start(() => {
      onClose();
    });
  };

  const resetPosition = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const handleBottomButton = () => {
    if (onPressAction) onPressAction();
    closeModal();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeModal}
      />
      <Animated.View
        style={[
          styles.modal,
          {
            height,
            transform: [{ translateY }],
          },
        ]}
        {...(isPanEnabled ? panResponder.panHandlers : {})}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.handle} />
            {isCancelButton && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 15,
                }}
              >
                <Pressable onPress={closeModal}>
                  <ThemedText style={{ fontSize: 20, color: colors.red.main }}>
                    Cancel
                  </ThemedText>
                </Pressable>
                {isHeader && (
                  <>
                    <ThemedText
                      type="semiBold"
                      style={{ fontSize: 20, color: colors.green.main }}
                    >
                      {headerTitle}
                    </ThemedText>
                    <Pressable onPress={onPressAction} disabled={disabled}>
                      <ThemedText
                        style={{
                          fontSize: 20,
                          color: disabled
                            ? colors.text.gray
                            : colors.green.main,
                        }}
                      >
                        Request
                      </ThemedText>
                    </Pressable>
                  </>
                )}
              </View>
            )}
            <View style={styles.children}>
              <>{children}</>
              {isButton && (
                <GlobalButton text="Got it" onPress={handleBottomButton} />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    gap: 15,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  children: {
    gap: 15,
  },
});

export default BottomSheetModal;
