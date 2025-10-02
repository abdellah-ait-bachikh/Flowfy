import logo from "@/assets/images/flowfy-bg-transparent-croped.png";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
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
      router.push("/(tabs)");
    }
  };
  return (
    <View style={[styles.wrapper, { paddingTop: top }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handelNavigateBack}>
          <SimpleLineIcons
            name="arrow-left"
            size={24}
            color="black"
            style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}
          />
        </TouchableOpacity>
        <View>
          <Image style={styles.logo} source={logo} />
        </View>
        <TouchableOpacity>
          <Feather name="phone" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
});
