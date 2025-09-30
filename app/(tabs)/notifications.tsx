import { View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import { schedulePushNotification } from "@/services/notifications";
import { useNotifications } from "@/components/provider/NotificationProvider";
import AppText from "@/components/ui/AppText";

export default function NotificationsScreen() {
  const { expoPushToken, notification } = useNotifications();
  const [status, setStatus] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    (typeof notification)[] | null[]
  >([]);
  const handleTestNotification = async () => {
    try {
      await schedulePushNotification();
      setStatus("Notification scheduled ✅ (will fire in 2s)");
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  };
  useEffect(() => {
    setNotifications((prev) => [notification, ...prev]);
  }, [notification]);
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-xl font-bold mb-4">Notifications Test</Text>

      <Button title="Send Test Notification" onPress={handleTestNotification} />

      {status && <Text className="mt-4">{status}</Text>}

      <View className="mt-6">
        <Text className="font-semibold">Expo Push Token:</Text>
        <Text selectable className="text-xs text-gray-600">
          {/* {expoPushToken ?? "Not available"} */}
        </Text>
      </View>

      {notifications.map((e, i) => (
        <View key={i}>
          <AppText>{e?.request.content.body}</AppText>
        </View>
      ))}
    </View>
  );
}
