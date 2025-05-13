import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// other comps
import CountdownTimer from "../CountdownTimer";
import GlobalButton from "../GlobalButton";
import SignalIcon from "../SignalIcon";
import { ThemedText } from "../ThemedText";

// icons / constants
import { colors } from "../../constants/colors";
import signalTypes, { SignalType } from "../../constants/signalTypes";
import walkThemes from "../../constants/walkThemes";

interface SignalMapModalProps {
  themeId?: number;
  onRespond: (signalId: number) => void;
  onCancel: (signalId: number) => void;
  data: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    categoryId: number;
    expiresAt: string;
  };
}

const SignalMapModal = ({ onRespond, onCancel, data }: SignalMapModalProps) => {
  const [theme, setTheme] = useState(walkThemes[0]);
  const [signalType, setSignalType] = useState<SignalType>(signalTypes[0]);
  const [approxTime, setApproxTime] = useState("");
  useEffect(() => {
    const fetchCategory = () => {
      if (data && data?.categoryId) {
        const category = signalTypes.find(
          (signal) => signal.id === data?.categoryId
        );
        if (category) {
          setSignalType(category);
        }
      }
    };
    fetchCategory();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <BlurView
          intensity={50}
          tint="light"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: 25,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "#f0f0f0",
            },
          ]}
        />
        <View style={styles.flexBox}>
          <View>
            <ThemedText
              type="semiBold"
              style={{ fontSize: 18, marginBottom: 5, width: 210 }}
            >
              {data?.title}
            </ThemedText>
            <CountdownTimer
              createdAt={data?.createdAt.slice(0, -5)}
              expiresAt={data?.expiresAt.slice(0, -5)}
            />
          </View>
          <SignalIcon
            signal={signalType}
            key={data?.id}
            size={60}
            imgSize={45}
            isShadow
          />
        </View>
        <GlobalButton
          text="Mark as Responded"
          onPress={() => onRespond(data?.id)}
        />
        <GlobalButton
          text="Cancel Signal"
          onPress={() => onCancel(data?.id)}
          color={colors.red.main}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    width: 320,
    padding: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5.47,
    },
    shadowOpacity: 0.05,
    shadowRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    gap: 10,
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  locationBox: {
    flexDirection: "row",
    gap: 5,
  },
  grayText: {
    color: colors.text.gray,
    fontSize: 15,
  },
});

export default SignalMapModal;
