/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "858269624186"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  return self.registration.showNotification("test", {
    body: "test"
  })
})