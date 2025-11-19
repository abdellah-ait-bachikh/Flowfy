import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";

const CustemTabs = () => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const tabs = [
    {
      label: t("tabs.home"),
      href: "/(tabs)",
      icon: <Feather size={28} name="home" />,
    },
    {
      label: t("tabs.search"),
      href: "/(tabs)/search",
      icon: <AntDesign size={28} name="search" />,
    },
    {
      label: t("tabs.bag"),
      href: "/(tabs)/bag",
      icon: <Feather size={28} name="shopping-cart" />,
    },
    {
      label: t("tabs.notifications"),
      href: "/(tabs)/notifications",
      icon: <Ionicons size={28} name="notifications-outline" />,
    },
    {
      label: t("tabs.profile"),
      href: "/(tabs)/profile/index",
      icon: <Octicons size={28} name="person" />,
    },
  ] as const;

  const handelNavigate = (
    href:
      | "/(tabs)"
      | "/(tabs)/search"
      | "/(tabs)/bag"
      | "/(tabs)/notifications"
      | "/(tabs)/profile/index"
  ) => {
    router.push(href);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {tabs.map((item, index) => (
        <TouchableOpacity
          style={styles.tab_btn}
          onPress={() => handelNavigate(item.href)}
        >
          {item.icon}
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.tab_label}
          >
            {item.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustemTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  tab_btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  tab_label: { fontSize: 12 },
});
