// Replace placeholders with your Firebase web app config.
// Firebase Console → Project settings → Your apps → Web app → SDK setup and configuration.
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDlC3rSRIX9nA8uld8yGLiG8_6CGhagfCA',
  authDomain: 'reviewtap-259289.firebaseapp.com',
  projectId: 'reviewtap-259289',
  storageBucket: 'reviewtap-259289.firebasestorage.app',
  messagingSenderId: '970730501921',
  appId: '1:970730501921:web:ae0fff97a054b7f9f8f060',
  measurementId: 'G-F16HE4SSK4',
};

// Public URL where the landing page is hosted (Cloudflare Workers Assets).
// Used to build the QR target URL — keep in sync with the deployed site.
export const LANDING_BASE_URL = 'https://reviewtap.rivenwebdesign-aiautomation.workers.dev';

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
