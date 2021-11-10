const newFriendSound = () =>
  import("../assets/sounds/FriendRequest.mp3" as any);
const mentionSound = () => import("../assets/sounds/Mention.mp3" as any);
const messageSound = () => import("../assets/sounds/Message.mp3" as any);

import store from "@/store/index";

function isBusy() {
  return (store.state as any)?.me?.user?.status === 3;
}
function isNotificationDisabled() {
  const state = localStorage["notificationSoundDisabled"];
  if (state === undefined) return false;
  return JSON.parse(state);
}
function isNotificationMentionOnly() {
  const state = localStorage["notificationMentionsOnly"];
  if (state === undefined) return false;
  return JSON.parse(state);
}

export default {
  notification: async (mentioned: boolean, dm: boolean) => {
    if (isBusy() || isNotificationDisabled()) return;
    if (isNotificationMentionOnly() && !mentioned && !dm) {
      return;
    }
    const audio = new Audio(
      mentioned
        ? (await mentionSound()).default
        : (await messageSound()).default
    );
    audio.play();
  },
  newFriend: async () => {
    if (isBusy() || isNotificationDisabled()) return;
    const audio = new Audio((await newFriendSound()).default);
    audio.play();
  },
};
