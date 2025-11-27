import { sendNotification } from './src/services/notificationService';
import dotenv from 'dotenv';

dotenv.config();

const token = process.argv[2];

if (!token) {
    console.error('Please provide an FCM token as an argument.');
    console.error('Usage: npx ts-node testNotification.ts <FCM_TOKEN>');
    process.exit(1);
}

const run = async () => {
    console.log('Sending test notification to:', token);
    await sendNotification(token, {
        title: 'Test Notification',
        body: 'This is a test notification from the backend!',
        data: { type: 'test' },
    });
};

run();
