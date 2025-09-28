import { StyleSheet, Text, View, ViewProps } from "react-native";
import React from "react";
import LinearGradientCmp from "./LinearGradientCmp";
import { appColors } from "@/const";
interface AppProps extends ViewProps {
  variant: "gradian" | "normal";
}
const Screen = ({ variant, ...res }: AppProps) => {
  if (variant === "gradian") {
    return (
      <LinearGradientCmp {...res} style={[styles.screen, res.style]} colors={[appColors.light_yellow,appColors.yellow]}>
        {res.children}
      </LinearGradientCmp>
    );
  }
  return (
    <View {...res} style={[styles.screen, res.style]}>
      {res.children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({ screen: { flex: 1 } });
