import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import CountdownTimer from "../CountdownTimer";
import GlobalButton from "../GlobalButton";
import GlobalInput from "../GlobalInput";
import SignalIcon from "../SignalIcon";
import { ThemedText } from "../ThemedText";
import BottomSheetModal from "./BottomSheetModal";
import ModalSection from "./ModalSection";

// icon / constants
import { colors } from "../../constants/colors";
import signalTypes, { SignalType } from "../../constants/signalTypes";

interface SignalModalProps {
  visible: boolean;
  onPress: (signalId: number) => void;
  onClose: () => void;
  data: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    categoryId: number;
    expiresAt: string;
  };
  buttonText: string;
  isAccept: boolean;
  message?: string;
  setMessage?: (msg: string) => void;
  handleExpired?: (signalId: number) => void;
}

const SignalModal: React.FC<SignalModalProps> = ({
  visible,
  onPress,
  onClose,
  data,
  buttonText,
  isAccept,
  message,
  setMessage,
  handleExpired,
}: SignalModalProps) => {
  const [signalType, setSignalType] = useState<SignalType>(signalTypes[0]);
  const [isExpired, setIsExpired] = useState(false);
  useEffect(() => {
    const fetchCategory = () => {
      if (data && data?.categoryId) {
        const category = signalTypes.find(
          (signal) => signal.id === data?.categoryId
        );
        if (category) {
          setSignalType(category);
        }
      }
    };
    fetchCategory();
  }, [data]);

  return (
    <BottomSheetModal
      isVisible={visible}
      onClose={onClose}
      height={500}
      isCancelButton
    >
      <View style={styles.header}>
        <SignalIcon
          signal={signalType}
          key={data?.id}
          size={120}
          imgSize={100}
          isShadow
        />
        <ThemedText
          type="semiBold"
          style={{
            color: colors.text.black,
            fontSize: 20,
            paddingVertical: 10,
          }}
        >
          {data?.title}
        </ThemedText>
        {isAccept && (
          <CountdownTimer
            createdAt={data.createdAt}
            expiresAt={data.expiresAt}
            onExpiredChange={(expired) => {
              if (expired) {
                setIsExpired(true);
                if (handleExpired) handleExpired(data.id);
              }
            }}
          />
        )}
      </View>
      <ModalSection>
        <GlobalInput
          placeholder="Leave a message"
          value={isAccept ? data?.description : message}
          readOnly={isAccept}
          multiline
          numberOfLines={3}
          onChangeText={isAccept ? undefined : setMessage}
        />
      </ModalSection>

      <GlobalButton
        text={isExpired ? "Expired" : buttonText}
        onPress={() => onPress(data.id)}
        disabled={isExpired}
      />
    </BottomSheetModal>
  );
};

export default SignalModal;

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  grayText: {
    color: colors.text.gray,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    color: colors.text.black,
    fontSize: 18,
    paddingVertical: 10,
  },
  description: {
    color: colors.text.gray,
  },
});
