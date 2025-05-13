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
  visible,
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
  }, [data]);

  const handleMessage = (value: string) => {
    setMessage(value);
  };

  return (
    <>
      <BottomSheetModal isVisible={visible} isCancelButton onClose={onClose} height={555}>
        <View style={styles.top}>
          <SignalIcon
            signal={signalType}
            key={data?.id}
            size={150}
            imgSize={125}
            isShadow
          />
          <ThemedText
            type="semiBold"
            style={{
              color: colors.text.black,
              fontSize: 18,
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
          disabled={isAccept ? false : message === ""}
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
});
