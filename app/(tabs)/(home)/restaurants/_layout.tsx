import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
                  freezeOnBlur: false,

        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
      }}
    />
  );
}
