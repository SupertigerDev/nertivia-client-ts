/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyBYRykWjjPicFkaiJ49C8GbUmbZUmJeWOg",
  authDomain: "dotted-clover-231410.firebaseapp.com",
  databaseURL: "https://dotted-clover-231410.firebaseio.com",
  projectId: "dotted-clover-231410",
  storageBucket: "dotted-clover-231410.appspot.com",
  messagingSenderId: "858269624186",
  appId: "1:858269624186:web:a3193c0b82097a41d918c3"
});
const nertiviaCDN = "https://media.nertivia.net/";

const messaging = firebase.messaging();

function bodyBuilder(isServer, username, message) {
  return isServer ? `${username}: ${message}` : message;
}
function titleBuilder(channel_name, username) {
  return channel_name ? `${channel_name} - ${username}` : username;
}

console.log("FCM Active");

self.addEventListener("notificationclick", function(event) {
  console.log("SW: Clicked notification", event);

  const { channel_id, server_id } = event.notification.data;

  event.notification.close();

  if (server_id) {
    self.clients.openWindow(`/app/servers/${server_id}/${channel_id}`);
    return;
  }
  self.clients.openWindow(`/app/dms/${channel_id}`);
});

messaging.setBackgroundMessageHandler(async payload => {
  const {
    avatar,
    channel_id,
    message,
    unique_id,
    username,
    channel_name,
    server_id
  } = payload.data;
  const isServer = channel_name;

  const tag = `${channel_id}`;
  const notifications = await registration.getNotifications({ tag });
  const title = titleBuilder(channel_name, username);
  const body = bodyBuilder(isServer, username, message);
  if (notifications[0]) {
    notifications[0].close();
    let messages = notifications[0].body.split("\n");
    messages = messages.slice(Math.max(messages.length - 3, 0));
    return self.registration.showNotification(title, {
      body: `${messages.join("\n")}\n${body}`,
      tag,
      icon: nertiviaCDN + avatar + "?type=webp",
      data: { channel_id, server_id }
    });
  }
  return self.registration.showNotification(title, {
    body,
    tag,
    icon: nertiviaCDN + avatar + "?type=webp",
    data: { channel_id, server_id }
  });
});
