import { NotificationProvider } from "@/components/app/provider/NotificationProvider";
import { store } from "@/redux/store";
import { initI18next } from "@/services/i18next";
import { ThemeProvider } from "@/theme/theme-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";

function RootLayout() {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NotificationProvider>
          <Provider store={store}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
                contentStyle: { flex: 1 },
              }}
              i18nIsDynamicList
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </Provider>
        </NotificationProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
export default RootLayout;
