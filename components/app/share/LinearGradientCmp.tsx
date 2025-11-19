import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type LinearGradientCmpProps = {
  children: React.ReactNode;
  colors: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

const LinearGradientCmp: React.FC<LinearGradientCmpProps> = ({
  children,
  colors, // default gradient
  style,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
}) => {
 
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default LinearGradientCmp;
