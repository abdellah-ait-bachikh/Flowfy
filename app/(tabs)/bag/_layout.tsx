import { Stack } from "expo-router";

export default function BagLAyout() {
  return (
    <Stack
      screenOptions={{                  freezeOnBlur: false,

        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
      }}
    />
  );
}
