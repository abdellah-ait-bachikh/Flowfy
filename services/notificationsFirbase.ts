import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';

export async function initFirebaseMessaging() {
  // Request permission
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    Alert.alert('Notifications permission not granted');
    return;
  }

  // Get FCM token
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  // Foreground messages
  return messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    Alert.alert(remoteMessage.notification?.title ?? '', remoteMessage.notification?.body ?? '');
  });
}

// Handle background/quit messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message:', remoteMessage);
});
