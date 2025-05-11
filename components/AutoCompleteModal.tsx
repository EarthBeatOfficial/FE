import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { ThemedText } from "./ThemedText";

interface AutoCompleteModalProps {
  fetchSuggestions: (input: string) => void;
  suggestions: Array<{ place_id: string; description: string }>;
  onSelect: (place_id: string) => void;
}

const AutoCompleteModal: React.FC<AutoCompleteModalProps> = ({
  fetchSuggestions,
  suggestions,
  onSelect,
}) => {
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (text: string) => {
    setInput(text);
    setSelectedId(null);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInput("");
    setSelectedId(null);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    fetchSuggestions(input);
    setShowSuggestions(true);
  };

  const handleSelect = (item: { place_id: string; description: string }) => {
    setInput(item.description);
    setSelectedId(item.place_id);
    setShowSuggestions(false);
    onSelect(item.place_id);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: "100%" }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={input}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                clearButtonMode="never"
              />
              {input.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#aaa" />
                </TouchableOpacity>
              )}
            </View>
            <View>
              {/* {showSuggestions && suggestions && (
              <FlatList
              data={suggestions}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.place_id}
              style={styles.suggestionList}
              renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={[
                    styles.suggestionItem,
                    item.place_id === selectedId && styles.selectedSuggestion,
                    ]}
                    >
                    <Text
                    style={{
                        color: item.place_id === selectedId ? "#fff" : "#222",
                        }}
                        >
                        {item.description}
                        </Text>
                        </TouchableOpacity>
                        )}
                        />
                        )} */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal visible={showSuggestions} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowSuggestions(false)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.suggestionList}>
              <ScrollView>
                {suggestions?.map((item, key) => {
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => handleSelect(item)}
                      style={[
                        styles.suggestionItem,
                        item.place_id === selectedId &&
                          styles.selectedSuggestion,
                      ]}
                    >
                      <ThemedText>{item.description}</ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    paddingRight: 36,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -10,
    zIndex: 2,
  },
  suggestionList: {
    maxHeight: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedSuggestion: {
    backgroundColor: "#4CAF50",
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
});

export default AutoCompleteModal;
