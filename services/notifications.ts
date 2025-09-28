import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

type NotificationHandler = (notification: Notifications.Notification) => void;
type NotificationResponseHandler = (
  response: Notifications.NotificationResponse
) => void;

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications(
  onReceive?: NotificationHandler,
  onRespond?: NotificationResponseHandler
) {
  await registerForPushNotificationsAsync();

  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      onReceive?.(notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      onRespond?.(response);
    });

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert("Must use physical device for Push Notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permissions not granted");
    return null;
  }

  // ✅ Use dynamic projectId from app.json
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  console.log("Expo Push Token:", token);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
