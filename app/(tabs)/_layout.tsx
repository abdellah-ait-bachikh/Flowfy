import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Tabs } from "expo-router";
import Screen from "@/components/ui/Screen";
import LinearGradientCmp from "@/components/ui/LinearGradientCmp";
import { appColors, fonts, tailwindColors } from "@/const";
import Header from "@/components/ui/Header";
import CustemTabs from "@/components/ui/CustemTabs";
import { enableScreens } from "react-native-screens";
import { useTranslation } from "react-i18next";
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import AppText from "@/components/ui/AppText";
import { BlurView } from "expo-blur";

const _layout = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      label: t("tabs.home"),
      name: "index",
      href: "/(tabs)",
      icon: <Feather size={28} name="home" />,
    },
    {
      label: t("tabs.search"),
      name: "search",
      href: "/(tabs)/search",
      icon: <Ionicons size={28} name="search" />,
    },
    {
      label: t("tabs.bag"),
      name: "bag",
      href: "/(tabs)/bag",
      icon: <Feather size={28} name="shopping-cart" />,
    },
    {
      label: t("tabs.notifications"),
      name: "notifications",
      href: "/(tabs)/notifications",
      icon: <Ionicons size={28} name="notifications-outline" />,
    },
    {
      label: t("tabs.profile"),
      name: "profile",
      href: "/(tabs)/profile/index",
      icon: <Octicons size={28} name="person" />,
    },
  ] as const;

  return (
    <LinearGradientCmp
      colors={[
        appColors.light_yellow,
        appColors.white,
        appColors.white,
        appColors.white,
        appColors.white,
        appColors.white,
      ]}
    >
      <Header />
      {/* 
      <Slot
        screenOptions={{ animation: "fade_from_bottom", unmountOnBlur: false }}
      /> */}
      <Tabs
        i18nIsDynamicList
        screenOptions={{
          headerShown: false,
          lazy: false,
          tabBarStyle: {
            position: Platform.OS === "ios" ? "absolute" : "relative",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "transparent",
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80} // change for stronger blur
              style={{ flex: 1, backgroundColor: "transparent" }}
            />
          ),
          sceneStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        {tabs.map((item, index) => (
          <Tabs.Screen
            name={item.name}
            options={{
              animation: "shift",
              tabBarIcon: ({ focused, color, size }) => {
                // Clone the icon element and override the color
                return React.cloneElement(item.icon, {
                  color: focused ? appColors.red : tailwindColors.zinc[400],
                  size: 28,
                });
              },
              tabBarLabel: ({ color, focused }) => (
                <AppText
                  style={{
                    fontSize: 10,
                    fontFamily: fonts["Montserrat-SemiBold"],
                    color: focused ? appColors.red : tailwindColors.zinc[400],
                  }}
                >
                  {item.label}
                </AppText>
              ),
              tabBarActiveTintColor: appColors.red,
            }}
          />
        ))}
      </Tabs>
      {/* <CustemTabs /> */}
    </LinearGradientCmp>
  );
};

export default _layout;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
