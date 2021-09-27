import firebaseApp from "firebase/app";
import "firebase/messaging";

let _messaging: firebaseApp.messaging.Messaging | null = null;
export const messagingSupported = firebaseApp.messaging.isSupported();

export function messaging(): firebaseApp.messaging.Messaging {
  if (_messaging) return _messaging;
  firebaseApp.initializeApp({
    apiKey: process.env.VUE_APP_FCM_API_KEY,
    authDomain: process.env.VUE_APP_FCM_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FCM_DATABASE_URL,
    projectId: process.env.VUE_APP_FCM_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FCM_SENDER_ID,
    appId: process.env.VUE_APP_FCM_APP_ID,
  });
  _messaging = firebaseApp.messaging();
  return _messaging;
}
