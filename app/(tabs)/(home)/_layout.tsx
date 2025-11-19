import CurrentBag from "@/components/app/share/CurrentBag";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (<>        <CurrentBag />

    <Stack
      screenOptions={{                  freezeOnBlur: false,

        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
      }}
    /></>
  );
}
