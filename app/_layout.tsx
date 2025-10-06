import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { initI18next } from "@/services/i18next";
import { NotificationProvider } from "@/components/provider/NotificationProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
export default function RootLayout() {
  const [loaded] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initI18next();
      setReady(true);
    }
    prepare();
  }, []);

  if (!loaded || !ready) {
    return null;
  }
  return (
    <NotificationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          />
        </Provider>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
}
