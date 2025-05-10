import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { ThemedText } from "./ThemedText";

interface TimePickerProps {
  onTimeSelect?: (minutes: number) => void;
  initialTime?: number; // in minutes
}

const TimePicker: React.FC<TimePickerProps> = ({
  onTimeSelect,
  initialTime = 10, // default 10 minutes
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      setSelectedTime(totalMinutes);
      onTimeSelect?.(totalMinutes);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  return (
    <View>
      <Pressable onPress={() => setShowPicker(true)} style={styles.timeButton}>
        <ThemedText style={styles.timeText}>
          {formatTime(selectedTime)}
        </ThemedText>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={
            new Date(0, 0, 0, Math.floor(selectedTime / 60), selectedTime % 60)
          }
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
          minuteInterval={10}
        />
      )}
    </View>
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
});

export default TimePicker;
