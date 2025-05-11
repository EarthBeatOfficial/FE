import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, View } from "react-native";

// other comps
import GlobalButton from "../GlobalButton";
import { ThemedText } from "../ThemedText";

// icons / constants
import LocationIcon from "@/assets/icons/location.png";
import { colors } from "../../constants/colors";
import walkThemes from "../../constants/walkThemes";

interface RouteModalProps {
  themeId: number;
  distance: number;
  onPress: () => void;
}

const RouteModal = ({ themeId, distance, onPress }: RouteModalProps) => {
  const [theme, setTheme] = useState(walkThemes[0]);
  useEffect(() => {
    const fetchTheme = () => {
      if (themeId) {
        const walkTheme = walkThemes.find((signal) => signal.id === themeId);
        if (walkTheme) {
          setTheme(walkTheme);
        }
      }
    };
    fetchTheme();
  }, []);

  return (
    <>
      <Modal transparent>
        <View style={styles.overlay}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.color.light,
              },
            ]}
          >
            <BlurView
              intensity={11}
              tint="light"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: 25,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: theme.color.main,
                },
              ]}
            />
            <View style={styles.flexBox}>
              <View>
                <ThemedText
                  type="semiBold"
                  style={{ fontSize: 20, marginBottom: 5 }}
                >
                  {theme.title.split(/[-&]/)[0]}-based
                </ThemedText>
                <View style={styles.locationBox}>
                  <Image
                    source={LocationIcon}
                    style={{ width: 22, height: 22 }}
                  />
                  <ThemedText
                    style={{ color: colors.darkGray.main, fontSize: 15 }}
                  >
                    {distance}km
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={{ fontSize: 30 }}>{theme.emoji}</ThemedText>
            </View>
            <GlobalButton
              text="Take Route"
              color={theme.color.main}
              onPress={onPress}
            />
          </View>
        </View>
      </Modal>
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
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  locationBox: {
    flexDirection: "row",
    gap: 5,
  },
});

export default RouteModal;
