import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import GlobalButton from "../GlobalButton";
import GlobalInput from "../GlobalInput";
import SignalIcon from "../SignalIcon";
import { ThemedText } from "../ThemedText";
import BottomSheetModal from "./BottomSheetModal";
import ModalSection from "./ModalSection";
import CountdownTimer from "../CountdownTimer";

// icon / constants
import TimeIcon from "@/assets/icons/time.png";
import { colors } from "../../constants/colors";
import signalTypes, { SignalType } from "../../constants/signalTypes";

interface SignalModalProps {
  countdown?: any;
  onPress: (id: number) => void;
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
}

const SignalModal = ({
  onPress,
  onClose,
  data,
  buttonText,
  isAccept,
}: SignalModalProps) => {
  const [signalType, setSignalType] = useState<SignalType>(signalTypes[0]);
  const [message, setMessage] = useState("");
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
  }, []);

  const handleMessage = (value: string) => {
    setMessage(value);
  };

  return (
    <>
      <BottomSheetModal isVisible isCancelButton onClose={onClose} height={585}>
        <View style={styles.top}>
          <SignalIcon
            signal={signalType}
            key={data?.id}
            size={175}
            imgSize={140}
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
              createdAt={data?.createdAt.slice(0, -5)}
              expiresAt={data?.expiresAt.slice(0, -5)}
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
            onChangeText={handleMessage}
          />
        </ModalSection>
        <GlobalButton
          text={buttonText}
          onPress={() => onPress(data?.id)}
          disabled={message === ""}
        />
      </BottomSheetModal>
    </>
  );
};

export default SignalModal;

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  grayText: {
    color: colors.text.gray,
  },
});
