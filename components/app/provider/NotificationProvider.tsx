import { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/services/notifications";
import { Href, useRouter } from "expo-router";

// Types
type NotificationContextType = {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Foreground listener
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);

        // Extract "href" from notification data
        const href = response.notification.request.content.data?.href as
          | string
          | undefined;
        if (href) {
          router.push(href as Href); // Navigate to /href
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook for easy access
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside a NotificationProvider"
    );
  }
  return context;
}
