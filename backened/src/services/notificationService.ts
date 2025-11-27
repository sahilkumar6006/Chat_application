import { messaging } from './firebase';
import admin from 'firebase-admin';


interface NotificationPayload {
    title: string;
    body: string;
    data?: { [key: string]: string };
}

export const sendNotification = async (
    token: string,
    payload: NotificationPayload
): Promise<string | null> => {
    try {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data,
            token: token,
        };

        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
};

export const sendMulticastNotification = async (
    tokens: string[],
    payload: NotificationPayload
): Promise<admin.messaging.BatchResponse | null> => {
    try {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data,
            tokens: tokens,
        };

        const response = await messaging.sendEachForMulticast(message);
        console.log(response.successCount + ' messages were sent successfully');
        return response;
    } catch (error) {
        console.error('Error sending multicast message:', error);
        return null;
    }
};
