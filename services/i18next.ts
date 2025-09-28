import i18next, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";
import { I18nManager } from "react-native";

// Define resources type
export const LanguageResources: Resource = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
};

export async function initI18next() {
  let lng = "ar";
  try {
    const savedLang = await AsyncStorage.getItem("user-language");
    if (savedLang) {
      lng = savedLang;
    }
  } catch (error) {
    console.error("Failed to load language from storage:", error);
  }

  await i18next.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng,
    fallbackLng: "ar",
    resources: LanguageResources,
    interpolation: {
      escapeValue: false,
    },
  });
  I18nManager.forceRTL(lng === "ar");

  return i18next;
}

export default i18next;
