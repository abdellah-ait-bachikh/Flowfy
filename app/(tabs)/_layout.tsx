import Header from "@/components/app/share/Header";
import LinearGradientCmp from "@/components/app/share/LinearGradientCmp";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { tabs } from "@/lib/const";
import { appColors, tailwindColors } from "@/theme/colors";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Tabs, usePathname } from "expo-router";

import React, { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

export default function TabLayout() {
  const primary = useColor("primary");
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
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
                animation: "none",
          tabBarPosition: "bottom",
          tabBarActiveTintColor: primary,
          header: () => <Header />,
          sceneStyle: { backgroundColor: "transparent" },
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              onPressIn={(ev) => {
                if (process.env.EXPO_OS === "ios") {
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
            paddingHorizontal: 6,
            paddingTop:5
          },
        }}
      >
        {tabs.map((item) => (
          <Tabs.Screen
            name={item.name}
            options={{
              title: item.label,
              tabBarItemStyle: {
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "transparent",
              },
              tabBarButton: (props) => {
                const { onPress, accessibilityState } = props;
                const focused = accessibilityState?.selected;
                const isCurrent =
                  (item.name === "(home)" && pathname === "/") ||
                  pathname === `/${item.name}` ||
                  pathname.startsWith(`/${item.name}/`);

                return (
                  <PlatformPressable
                    {...props}
                    onPress={onPress}
                    style={[
                      {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: isCurrent
                          ? appColors.light_yellow
                          : "transparent",
                      },
                    ]}
                  />
                );
              },
              tabBarIcon: ({ color, focused }) => (
                <item.icon
                  size={24}
                  color={focused ? appColors.black : tailwindColors.gray[400]}
                />
              ),
              tabBarLabel: ({ color, focused }) => (
                <Text
                  style={{
                    color: focused ? color : tailwindColors.gray[400],
                    fontSize: 10,
                    fontWeight: focused ? "600" : "400",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="clip"
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
