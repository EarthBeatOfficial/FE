import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

// nested comps
import GlobalButton from "./GlobalButton";
import { ThemedText } from "./ThemedText";

import { colors } from "../constants/colors";

interface TimePickerProps {
  onTimeSelect?: (minutes: number) => void;
  initialTime?: number; // in minutes
  onOpen: () => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 6 }, (_, i) => i * 10);

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

  const handleConfirm = () => {
    setShow(false);
    onOpen();
    const totalMinutes = selectedHour * 60 + selectedMinute;
    onTimeSelect?.(totalMinutes);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  //   useEffect(() => {
  //     setSelectedHour(Math.floor(initialTime / 60));
  //     setSelectedMinute(initialTime % 60);
  //   }, [!show]);

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
            {/* {formatTime(selectedHour * 60 + selectedMinute)} */}
            {selectedHour.toString().padStart(2, "0")}h{" "}
            {selectedMinute.toString().padStart(2, "0")}min
          </ThemedText>
        </Pressable>
      </View>
      <Modal visible={show} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Picker
                selectedValue={selectedHour}
                style={styles.picker}
                onValueChange={setSelectedHour}
              >
                {hours.map((h) => (
                  <Picker.Item
                    key={h}
                    label={`${h}h`}
                    value={h}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedMinute}
                style={styles.picker}
                onValueChange={setSelectedMinute}
              >
                {minutes.map((m) => (
                  <Picker.Item
                    key={m}
                    label={`${m}m`}
                    value={m}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
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
  },
  picker: {
    flex: 1,
    color: colors.darkGray.main,
  },
  confirmButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  confirmText: {
    fontWeight: "bold",
  },
  pickerItem: {
    color: colors.darkGray.main,
  },
});

export default TimePicker;
