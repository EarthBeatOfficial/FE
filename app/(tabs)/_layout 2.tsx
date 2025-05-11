// import { colors } from "@/constants/colors";
// import { Tabs } from "expo-router";
// import { Image } from "react-native";

// // Import your tab icons here
// import HomeIcon from "@/assets/icons/home.png";
// import MapIcon from "@/assets/icons/map.png";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: "#FFFFFF",
//           borderTopWidth: 1,
//           borderTopColor: "#E5E5E5",
//           height: 60,
//           paddingBottom: 10,
//         },
//         tabBarActiveTintColor: colors.green.main,
//         tabBarInactiveTintColor: colors.text.gray,
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <Image
//               source={HomeIcon}
//               style={{ width: 24, height: 24, tintColor: color }}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="map"
//         options={{
//           title: "Map",
//           tabBarIcon: ({ color }) => (
//             <Image
//               source={MapIcon}
//               style={{ width: 24, height: 24, tintColor: color }}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
