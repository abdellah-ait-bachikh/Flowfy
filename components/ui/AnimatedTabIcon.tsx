import { appColors, tailwindColors } from "@/lib/const";
import React from "react";
import { View } from "react-native";

const AnimatedTabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: React.JSX.Element;
}) => {
  return (
    <View
      style={{
        width: 60,
        backgroundColor: focused ? tailwindColors.red[100] : "transparent",
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      {React.cloneElement(icon, {
        color: focused ? appColors.red : tailwindColors.zinc[400],
        size: 26,
      })}
    </View>
  );
};

export default AnimatedTabIcon;
