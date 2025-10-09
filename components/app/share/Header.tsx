import logo from "@/assets/images/flowfy-bg-transparent-croped.png";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import { usePathname, useRouter } from "expo-router";
import { ChevronLeft, Headset, PhoneOutgoing } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import * as Clipboard from "expo-clipboard";

const Header: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { isVisible, open, close } = useBottomSheet();

  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const handelNavigateBack = () => {
    if (pathname === "/") {
      if (router.canGoBack()) {
        router.back();
      } else {
        return;
      }
      router.replace("/");
    } else {
      router.push("/(tabs)/(home)");
    }
  };
const makePhoneCall = async (number: string) => {
  const url = `tel:${number}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert(
        "Error",
        "Your device does not support phone calls",
        [
          {
            text: "Copy Number",
            onPress: async () => {
              await Clipboard.setStringAsync(number);
              Alert.alert("Copied", "Phone number copied to clipboard!");
            },
          },
          { text: "OK", style: "cancel" },
        ]
      );
      return;
    }
    Linking.openURL(url);
  } catch (err) {
    console.error("Failed to make a phone call:", err);
    Alert.alert(
      "Error",
      "Could not open the dialer",
      [
        {
          text: "Copy Number",
          onPress: async () => {
            await Clipboard.setStringAsync(number);
            Alert.alert("Copied", "Phone number copied to clipboard!");
          },
        },
        { text: "OK", style: "cancel" },
      ]
    );
  }
};
  return (
    <View style={[styles.wrapper, { paddingTop: top }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handelNavigateBack}>
          <ChevronLeft
            size={24}
            color="black"
            style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}
          />
        </TouchableOpacity>
        <View>
          <Image style={styles.logo} source={logo} />
        </View>
        <TouchableOpacity onPress={open}>
          <Headset size={24} color="black" />
        </TouchableOpacity>
      </View>
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title="Settings"
        snapPoints={[0.3, 0.6, 0.9]}
      >
        <View style={styles.botton_sheet_content_style}>
          <Button
            style={{ backgroundColor: tailwindColors.slate[300] }}
            onPress={() => makePhoneCall("0628958346")}
          >
            <View style={styles.btn_content}>
              <PhoneOutgoing size={24} color="black" />
              <AppText style={styles.btn_text}>Start a Call</AppText>
            </View>
          </Button>
          <Button style={{ backgroundColor: tailwindColors.emerald[200] }}>
            <View style={styles.btn_content}>
              <FontAwesome name="whatsapp" size={24} color="black" />
              <AppText style={styles.btn_text}>
                Send Message via WhatsApp
              </AppText>
            </View>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    // position: "absolute",
    // top: 0,
    // width: "100%",
    // zIndex: 10,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "transparent",

    width: "100%",
    backdropFilter: "blur(10px)",
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },
  botton_sheet_content_style: {
    gap: 10,
    height: "100%",
  },
  btn_content: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  btn_text: {
    fontFamily: fonts["Montserrat-SemiBold"],
  },
});
