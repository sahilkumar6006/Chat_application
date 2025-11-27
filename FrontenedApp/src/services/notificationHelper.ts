import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    } else if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Notification permission granted');
            } else {
                console.log('Notification permission denied');
            }
        }
    }
};

export const getFCMToken = async () => {
    try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

export const notificationListener = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
            }
        });

    // Foreground message handling
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // You can show a local notification here using react-native-notifee or similar if needed
        // For now, we just log it. Alerting might be too intrusive.
    });

    return unsubscribe;
};
