import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import GlobalInput from "../GlobalInput";
import BottomSheetModal from "./BottomSheetModal";
import ModalSection from "./ModalSection";
import SignalIcon from "../SignalIcon";

import signalTypes from "../../constants/signalTypes";

interface SignalModalProps {
  categoryId: number;
  title: string;
  countdown?: any;
  description?: string;
  onPress: () => void;
  onClose: () => void;
}

const SignalModal = ({
  categoryId = 1,
  title,
  countdown,
  description,
  onPress,
  onClose,
}: SignalModalProps) => {
  const [signalType, setSignalType] = useState(signalTypes[0]);
  useEffect(() => {
    const fetchCategory = () => {
      if (categoryId) {
        const category = signalTypes.find((signal) => signal.id === categoryId);
        // setSignalType(category);
      }
    };
    fetchCategory();
  }, []);
  return (
    <>
      <BottomSheetModal isVisible isCancelButton onClose={onClose}>
        <SignalIcon signal={signalType} key={categoryId} />
        <ModalSection>
          <GlobalInput />
        </ModalSection>
      </BottomSheetModal>
    </>
  );
};

export default SignalModal;

const styles = StyleSheet.create({});
