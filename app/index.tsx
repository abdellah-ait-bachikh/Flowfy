import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  I18nManager,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import Screen from "@/components/ui/Screen";
import { appColors, fonts, tailwindColors } from "@/const";
import AppText from "@/components/ui/AppText";
import { useTranslation } from "react-i18next";
import logo from "@/assets/images/flowfy-bg-transparent-croped.png";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

const Index: React.FC = () => {
  const { t, i18n } = useTranslation();
  const shineAnim = useRef(new Animated.Value(-1)).current;
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const [open, setOpen] = useState(false);
  const [ln, setLn] = useState(i18n.language);
  const [items, setItems] = useState([
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
    { label: "العربية", value: "ar" },
  ]);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang) {
        setLn(savedLang);
        await i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    const loop = () => {
      shineAnim.setValue(-1);
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => loop());
    };
    loop();
  }, [shineAnim]);

  const translateX = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  const handleChangeLanguage = async (lng: "en" | "fr" | "ar") => {
    setLn(lng);
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem("appLanguage", lng);

    if (lng === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  return (
    <Screen style={styles.screen} variant="gradian">
      <View style={[styles.language_switcher, { top }]}>
        <DropDownPicker
          open={open}
          value={ln}
          items={items}
          setOpen={setOpen}
          setValue={setLn}
          setItems={setItems}
          style={styles.select_ln}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          closeOnBackPressed={true}
          onChangeValue={(val) => {
            if (val && (val === "ar" || val === "fr" || val === "en"))
              handleChangeLanguage(val);
          }}
        />
      </View>

      <Image source={logo} style={styles.logo} />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          router.push("/(tabs)");
        }}
      >
        <AppText style={styles.btn_text}>
          {t("screens.index.explor_app")}
        </AppText>
        <Animated.View
          style={[
            styles.shine,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </TouchableOpacity>
    </Screen>
  );
};

export default Index;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: appColors.yellow,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    gap: 30,
  },
  select_ln: {
    width: 120,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  dropDownContainerStyle: {
    backgroundColor: tailwindColors.yellow[100],
    borderColor: "transparent",
    borderRadius: 15,
  },
  language_switcher: { position: "absolute", justifyContent: "center" },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
  btn: {
    borderWidth: 3,
    borderColor: appColors.light_yellow,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    overflow: "hidden",
  },
  btn_text: {
    fontSize: 18,
    fontFamily: fonts["Montserrat-Medium"],
    color: appColors.black,
  },
  shine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: appColors.light_yellow,
    borderRadius: 15,
  },
});
