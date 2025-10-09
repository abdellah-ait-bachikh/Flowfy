import AnimatedTabIcon from "@/components/app/share/AnimatedTabIcon";
import Header from "@/components/app/share/Header";
import LinearGradientCmp from "@/components/app/share/LinearGradientCmp";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { tabs } from "@/lib/const";
import { appColors, tailwindColors } from "@/theme/colors";
import { PlatformPressable } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Home, Stars } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

export default function TabLayout() {
  const primary = useColor("primary");
  const { width } = useWindowDimensions();

  return (
    <LinearGradientCmp
      colors={[
        appColors.light_yellow,
        appColors.white,
        appColors.white,
        appColors.white,
        appColors.white,
      ]}
    >
      <Tabs
        initialRouteName="(home)"
        screenOptions={{
          tabBarPosition: "bottom",
          tabBarActiveTintColor: primary,
          header: () => <Header />,
          sceneStyle: { backgroundColor: "transparent" },
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              onPressIn={(ev) => {
                if (process.env.EXPO_OS === "ios") {
                  // Add a soft haptic feedback when pressing down on the tabs.
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn?.(ev);
              }}
            />
          ),
          tabBarStyle: {
            position: Platform.OS === "ios" ? "absolute" : "relative",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "transparent",
          },
        }}
      >
        {tabs.map((item) => (
          <Tabs.Screen
            name={item.name}
            options={{
              title: item.label,
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon focused={focused} icon={item.icon} />
              ),
              tabBarLabel: ({ color, focused }) => (
                <Text
                  style={{
                    color: focused ? color : tailwindColors.gray[400],
                    fontSize: 12,
                    fontWeight: focused ? "600" : "400",
                  }}
                >
                  {item.label}
                </Text>
              ),
            }}
          />
        ))}
      </Tabs>
    </LinearGradientCmp>
  );
}
