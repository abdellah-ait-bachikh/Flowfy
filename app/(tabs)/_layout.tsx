import AnimatedTabIcon from "@/components/ui/AnimatedTabIcon";
import AppText from "@/components/ui/AppText";
import Header from "@/components/ui/Header";
import LinearGradientCmp from "@/components/ui/LinearGradientCmp";
import { appColors, fonts, tailwindColors } from "@/lib/const";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

const _layout = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      label: t("tabs.home"),
      name: "(home)",
      href: "/(tabs)/home",
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
        initialRouteName="(home)"
        i18nIsDynamicList
        screenOptions={{
          headerShown: false,
          // lazy: false,
          tabBarStyle: {
            position: Platform.OS === "ios" ? "absolute" : "relative",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "transparent",
          },
          sceneStyle: {
            backgroundColor: "transparent",flex:1
          },
        }}
      >
        {tabs.map((item, index) => (
          <Tabs.Screen
            name={item.name}
            options={{
              tabBarItemStyle: { flexDirection: "column" },
              animation: "none",
              tabBarIcon: ({ focused, color, size }) => {
                return <AnimatedTabIcon focused={focused} icon={item.icon} />;
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
