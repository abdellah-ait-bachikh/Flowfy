import { StyleSheet, Text, TextProps,  } from "react-native";
import React from "react";
import { fonts } from "@/lib/const";

const AppText = (props: TextProps) => {
  return (
    <Text {...props} style={[{ fontFamily: fonts.Montserrat}, props.style]}>
      {props.children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({});
