import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

// icons / constants
import ExpiredTimeIcon from "@/assets/icons/expiredTime.png";
import TimeIcon from "@/assets/icons/time.png";
import { colors } from "../constants/colors";

interface CountdownTimerProps {
  createdAt: Date | string;
  expiresAt: Date | string;
  onTimeUp?: () => void;
  onExpiredChange?: (isExpired: boolean) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  createdAt,
  expiresAt,
  onTimeUp,
  onExpiredChange,
}) => {
  // Parse dates if they are strings
  const created =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const expires =
    typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;

  const getInitialTimeLeft = () => {
    const now = new Date();
    return Math.max(
      0,
      Math.floor((expires.getTime() - created.getTime()) / 1000)
    );
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft());
  const [isExpired, setIsExpired] = useState<boolean>(timeLeft <= 0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const remainingSeconds = Math.floor(
        (expires.getTime() - now.getTime()) / 1000
      );

      if (remainingSeconds <= 0) {
        onTimeUp?.();
        setIsExpired(true);
        onExpiredChange?.(true);
        return 0;
      }
      return remainingSeconds;
    };

    // Update immediately
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    setIsExpired(initialTime <= 0);
    onExpiredChange?.(initialTime <= 0);

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      setIsExpired(remaining <= 0);
      onExpiredChange?.(remaining <= 0);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, expiresAt, onTimeUp, onExpiredChange]);

  const formatTime = (seconds: number) => {
    if (isExpired) return "Expired";

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
      <Image
        source={isExpired || timeLeft <= 300 ? ExpiredTimeIcon : TimeIcon}
        style={{ width: 20, height: 20 }}
      />
      <ThemedText
        style={[styles.timer, (isExpired || timeLeft <= 300) && styles.warning]}
      >
        {formatTime(timeLeft)}
        {!isExpired && " remaining"}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timer: {
    fontSize: 14,
    color: colors.darkGray.main,
  },
  warning: {
    color: colors.red.main,
  },
});

export default CountdownTimer;
