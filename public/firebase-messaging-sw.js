/* eslint-disable no-undef */
importScripts("swenv.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURLr,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
});
const nertiviaCDN = process.env.nertiviaCDN;

const messaging = firebase.messaging();

function bodyBuilder(server_id, username, message) {
  return server_id ? `${username}: ${message}` : message;
}
function titleBuilder(server_name, channel_name, username) {
  return channel_name ? `${server_name}#${channel_name}` : username;
}

console.log("FCM Active");

self.addEventListener("notificationclick", function (event) {
  console.log("SW: Clicked notification", event);

  const { channel_id, server_id } = event.notification.data;

  event.notification.close();

  if (server_id) {
    self.clients.openWindow(`/app/servers/${server_id}/${channel_id}`);
    return;
  }
  self.clients.openWindow(`/app/dms/${channel_id}`);
});

messaging.setBackgroundMessageHandler(async (payload) => {
  const {
    avatar,
    channel_id,
    message,
    unique_id,
    username,
    channel_name,
    server_id,
    server_name,
  } = payload.data;

  const tag = `${channel_id}`;
  const notifications = await registration.getNotifications({ tag });
  const title = titleBuilder(server_name, channel_name, username);
  const body = bodyBuilder(server_id, username, message);
  if (notifications[0]) {
    notifications[0].close();
    let messages = notifications[0].body.split("\n");
    messages = messages.slice(Math.max(messages.length - 3, 0));
    return self.registration.showNotification(title, {
      body: `${messages.join("\n")}\n${body}`,
      tag,
      icon: nertiviaCDN + avatar + "?type=webp",
      data: { channel_id, server_id },
    });
  }
  return self.registration.showNotification(title, {
    body,
    tag,
    icon: nertiviaCDN + avatar + "?type=webp",
    data: { channel_id, server_id },
  });
});
