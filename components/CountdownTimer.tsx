import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { ThemedText } from "./ThemedText";

interface CountdownTimerProps {
  timeLimit: number; // in minutes
  startTime: Date;
  onTimeUp?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeLimit,
  startTime,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit * 60); // convert to seconds

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      const remainingSeconds = timeLimit * 60 - elapsedSeconds;

      if (remainingSeconds <= 0) {
        onTimeUp?.();
        return 0;
      }

      return remainingSeconds;
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, startTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <ThemedText
        style={[
          styles.timer,
          timeLeft <= 300 && styles.warning, // Red color when less than 5 minutes left
        ]}
      >
        {formatTime(timeLeft)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 16,
    color: colors.darkGray.main,
    fontFamily: "Poppins_600SemiBold",
  },
  warning: {
    color: colors.red.main,
  },
});

export default CountdownTimer;
