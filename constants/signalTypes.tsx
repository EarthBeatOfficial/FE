interface SignalType {
  id: number;
  title: string;
  color: string;
  image: any;
}

const signalTypes: SignalType[] = [
  {
    id: 1,
    title: "Water Plants / Plant-Related",
    color: "rgba(227, 185, 137, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 2,
    title: "Repair / Tools",
    color: "rgba(161, 178, 193, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 3,
    title: "Delivery",
    color: "rgba(230, 205, 93, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 4,
    title: "Catch the Bug",
    color: "rgba(225, 39, 15, 0.3)",
    image: require("../assets/icons"),
  },
  {
    id: 5,
    title: "Translate",
    color: "rgba(0, 102, 202, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 6,
    title: "Pet-Related",
    color: "rgba(112, 57, 59, 0.3)",
    image: require("../assets/icons"),
  },
  {
    id: 7,
    title: "Lend / Borrow Batteries",
    color: "rgba(90, 211, 105, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 8,
    title: "Lost & Found",
    color: "rgba(87, 163, 226, 0.4)",
    image: require("../assets/icons"),
  },
  {
    id: 9,
    title: "Take picture(s)",
    color: "rgba(49, 39, 45, 0.3)",
    image: require("../assets/icons"),
  },
  {
    id: 10,
    title: "etc.",
    color: "rgba(26, 158, 170, 0.3)",
    image: require("../assets/icons"),
  },
];

export default signalTypes;
