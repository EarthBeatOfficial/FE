import storage from "@react-native-async-storage/async-storage";

export default {
  key: "root",
  storage,
  whitelist: ["user", "route", "signal"],
};