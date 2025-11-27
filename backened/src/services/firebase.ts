import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

let firebaseApp: admin.app.App | undefined;

try {
  // Check if app is already initialized to avoid errors in hot-reload environments
  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log('Firebase Admin Initialized successfully');
  } else {
    firebaseApp = admin.app();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.error('Make sure serviceAccountKey.json is present in the backend root directory.');
}

export const messaging = admin.messaging();
export default firebaseApp;
