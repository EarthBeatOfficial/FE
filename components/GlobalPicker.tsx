// import { Picker } from "@react-native-picker/picker";
// import React from "react";
// import { Platform, StyleSheet, View } from "react-native";
// import { useThemeColor } from "../hooks/useThemeColor";
// import { ThemedText } from "./ThemedText";

// interface GlobalPickerProps {
//   items: Array<{ label: string; value: string | number }>;
//   selectedValue: string | number;
//   onValueChange: (value: string | number) => void;
//   placeholder?: string;
//   label?: string;
//   error?: string;
// }

// export const GlobalPicker: React.FC<GlobalPickerProps> = ({
//   items,
//   selectedValue,
//   onValueChange,
//   placeholder = "Select an option",
//   label,
//   error,
// }) => {
//   const backgroundColor = useThemeColor({}, "background");
//   const textColor = useThemeColor({}, "text");
//   const borderColor = error ? "#ff3b30" : useThemeColor({}, "border");

//   return (
//     <View style={styles.container}>
//       {label && <ThemedText style={styles.label}>{label}</ThemedText>}
//       <View style={[styles.pickerContainer, { borderColor }]}>
//         <Picker
//           selectedValue={selectedValue}
//           onValueChange={onValueChange}
//           style={[
//             styles.picker,
//             { color: textColor },
//             Platform.OS === "web" && styles.webPicker,
//           ]}
//           dropdownIconColor={textColor}
//         >
//           {!selectedValue && (
//             <Picker.Item label={placeholder} value="" color={textColor} />
//           )}
//           {items.map((item) => (
//             <Picker.Item
//               key={item.value}
//               label={item.label}
//               value={item.value}
//               color={textColor}
//             />
//           ))}
//         </Picker>
//       </View>
//       {error && <ThemedText style={styles.error}>{error}</ThemedText>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     marginBottom: 8,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   picker: {
//     height: 50,
//   },
//   webPicker: {
//     width: "100%",
//     backgroundColor: "transparent",
//   },
//   error: {
//     color: "#ff3b30",
//     fontSize: 14,
//     marginTop: 4,
//   },
// });
