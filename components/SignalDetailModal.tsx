import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// 이 파일에서 사용하는 Signal 타입을 다시 선언
interface Signal {
  id: number;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "waiting" | "accepted" | "resolved";
  resolveMessage?: string;
}

interface Props {
  visible: boolean;
  signal: Signal | null;
  onAccept: () => void;
  onResolve: (message: string) => void;
  onCancel: () => void;
}

export default function SignalDetailModal({
  visible,
  signal,
  onAccept,
  onResolve,
  onCancel,
}: Props) {
  const [message, setMessage] = useState<string>("");

  if (!signal) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={{ color: "#e74c3c" }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{signal.title}</Text>
          <Text style={styles.desc}>{signal.description}</Text>

          {signal.status === "waiting" && (
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
              <Text style={{ color: "#fff" }}>Accept</Text>
            </TouchableOpacity>
          )}

          {signal.status === "accepted" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Leave a message"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={() => onResolve(message)}
              >
                <Text style={{ color: "#fff" }}>Mark as Resolved</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn2} onPress={onCancel}>
                <Text style={{ color: "#e74c3c" }}>Cancel Signal</Text>
              </TouchableOpacity>
            </>
          )}

          {signal.status === "resolved" && (
            <Text style={styles.resolvedText}>✅ Resolved!</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  cancelBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    marginBottom: 16,
    color: "#555",
  },
  acceptBtn: {
    backgroundColor: "#2d6a4f",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  resolveBtn: {
    backgroundColor: "#40916c",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelBtn2: {
    marginTop: 8,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    width: "100%",
    marginTop: 8,
  },
  resolvedText: {
    color: "#40916c",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 16,
  },
});
