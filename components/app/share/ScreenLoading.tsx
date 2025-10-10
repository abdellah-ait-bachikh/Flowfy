import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import AppText from "./AppText";
import { appColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import { FONT_SIZE_MEDUIME, FONT_SIZE_TITLE } from "@/theme/globals";

const ScreenLoading = ({ label = "loading..." }: { label?: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ gap: 5 }}>
        <Spinner color={appColors.yellow} size="xxl" variant="default" />
        <AppText style={{ fontFamily: fonts["Montserrat-Medium"] ,fontSize:FONT_SIZE_MEDUIME}}>
          
          {label}
        </AppText>
      </View>
    </View>
  );
};

export default ScreenLoading;

const styles = StyleSheet.create({});
