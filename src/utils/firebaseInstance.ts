import firebaseApp from "firebase/app";
import "firebase/messaging";
import config from "@/config";

let _messaging: firebaseApp.messaging.Messaging | null = null;

export function messaging(): firebaseApp.messaging.Messaging {
  if (_messaging) return _messaging;
  firebaseApp.initializeApp(config.firebase);
  _messaging = firebaseApp.messaging();
  return _messaging;
}
