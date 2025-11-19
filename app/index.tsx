import { I18nManager, Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import LinearGradientCmp from "@/components/app/share/LinearGradientCmp";
import { appColors } from "@/theme/colors";
import { Picker } from "@/components/ui/picker";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "@/assets/images/flowfy-bg-transparent-croped.png";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
const index = () => {
  const [ln, setLn] = useState("fr");
  const { i18n, t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const handelLnChange = async (value: "en" | "fr" | "ar") => {
    setLn(value);
    i18n.changeLanguage(value);
    await AsyncStorage.setItem("appLanguage", value);

    if (value === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  return (
    <LinearGradientCmp colors={[appColors.light_yellow, appColors.yellow]}>
      <View style={styles.screen}>
        <View style={[styles.picker_container, { top: top }]}>
          <Picker
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
            options={[
              { label: "English", value: "en" },
              { label: "Français", value: "fr" },
              { label: "العربية", value: "ar" },
            ]}
            value={ln}
            onValueChange={(value) =>
              handelLnChange(value as "en" | "fr" | "ar")
            }
            placeholder="Select language..."
          />
        </View>
        <Image source={logo} style={styles.logo} />

        <Button
          style={styles.btn}
          textStyle={styles.btnText}
          //   delayPressIn={0}
          //   delayPressOut={0}
          //   delayLongPress={0}

          touchSoundDisabled={false}
          onPress={() => {
            router.push("/(tabs)/(home)");
          }}
        >
          {t("screens.index.explor_app")}
        </Button>
      </View>
    </LinearGradientCmp>
  );
};

export default index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    gap: 20,
  },
  picker_container: {
    position: "absolute",
    width: 150,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
  btn: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: appColors.light_yellow,
  },
  btnText: {
    color: appColors.black,
  },
});
