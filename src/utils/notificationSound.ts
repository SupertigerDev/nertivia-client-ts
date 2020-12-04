import messageSound from "@/assets/sounds/Message.mp3";
import mentionSound from "@/assets/sounds/Mention.mp3";
import newFriendSound from "@/assets/sounds/FriendRequest.mp3";

import store from "@/store/index";




function isBusy() {
  return (store.state as any)?.me?.user?.status === 3;
}
function isNotificationDisabled() {
  const state = localStorage["notificationSoundDisabled"]
  if (state === undefined) return true;
  return JSON.parse(state);
}

export default {
  notification: (mentioned: boolean) => {
    if (isBusy() || isNotificationDisabled()) return;
    const audio = new Audio(mentioned ? mentionSound : messageSound);
    audio.play();
  },
  newFriend: () => {
    if (isBusy() || isNotificationDisabled()) return;
    const audio = new Audio(newFriendSound);
    audio.play();
  }
};

