import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: false,
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
      }}
    />
  );
}
