import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

// nested comps
import GlobalButton from "./GlobalButton";
import { ThemedText } from "./ThemedText";

import { colors } from "../constants/colors";

interface TimePickerProps {
  onTimeSelect?: (minutes: number) => void;
  initialTime?: number; // in minutes
  onOpen: () => void;
}

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}h`,
  value: i,
}));

const minutes = Array.from({ length: 6 }, (_, i) => ({
  label: `${i * 10}m`,
  value: i * 10,
}));

const TimePicker: React.FC<TimePickerProps> = ({
  onTimeSelect,
  initialTime = 10, // default 10 minutes
  onOpen,
}) => {
  const [show, setShow] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    Math.floor(initialTime / 60)
  );
  const [selectedMinute, setSelectedMinute] = useState(initialTime % 60);

  // Dropdown states
  const [hourOpen, setHourOpen] = useState(false);
  const [minuteOpen, setMinuteOpen] = useState(false);

  const handleConfirm = () => {
    setShow(false);
    onOpen();
    const totalMinutes = selectedHour * 60 + selectedMinute;
    onTimeSelect?.(totalMinutes);
  };

  return (
    <>
      <View>
        <Pressable
          onPress={() => {
            setShow(true);
            onOpen();
          }}
          style={styles.timeButton}
        >
          <ThemedText style={styles.timeText}>
            {selectedHour.toString().padStart(2, "0")}h{" "}
            {selectedMinute.toString().padStart(2, "0")}min
          </ThemedText>
        </Pressable>
      </View>
      <Modal visible={show} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={hourOpen}
                  value={selectedHour}
                  items={hours}
                  setOpen={setHourOpen}
                  setValue={setSelectedHour}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={styles.dropdownList}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={minuteOpen}
                  value={selectedMinute}
                  items={minutes}
                  setOpen={setMinuteOpen}
                  setValue={setSelectedMinute}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={styles.dropdownList}
                  zIndex={2000}
                  zIndexInverse={2000}
                />
              </View>
            </View>
            <GlobalButton text="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    backgroundColor: colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkGray.light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  timeText: {
    fontSize: 16,
    color: colors.darkGray.main,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
    minHeight: 50,
  },
  dropdown: {
    borderColor: colors.darkGray.light,
    backgroundColor: colors.light.background,
  },
  dropdownText: {
    color: colors.darkGray.main,
    fontSize: 16,
  },
  dropdownList: {
    borderColor: colors.darkGray.light,
    backgroundColor: colors.light.background,
  },
});

export default TimePicker;
