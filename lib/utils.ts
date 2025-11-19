import * as Notifications from "expo-notifications";

export const showNotification = async (notification: {
  title: string;
  body: string;
  data: { info: string };
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: notification.data,
    },
    trigger: null,
  });
};

export const renderStars = (rating: number, maxStars = 5) => {
  return Array.from({ length: maxStars }, (_, i) => {
    const starNumber = i + 1;

    if (rating >= starNumber) {
      // full star
      return "star";
    } else if (rating >= starNumber - 0.5) {
      // half star
      return "star-half-full"; // in FontAwesome
    } else {
      // empty star
      return "star-o"; // outlined star
    }
  });
};

export function formateMaxNumber(number: number, max: number):string {
  return number > max ? `+${max}` : `${number}`;
}

