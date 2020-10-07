<template>
  <div class="actionMessage">
    <AvatarImage
      class="avatar"
      :imageId="message.creator.avatar"
      :seedId="message.creator.uniqueID"
      :animateGif="false"
      size="40px"
    />
    <div class="details">
      <div class="message">
        <span class="username">{{ message.creator.username }}</span
        >&nbsp;
        <span class="msg" :style="{ color: type.color }">{{
          type.message
        }}</span>
      </div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Message from "@/interfaces/Message";
import AvatarImage from "@/components/AvatarImage.vue";
import friendlyTime from "@/utils/date";

const types = [
  {},
  { color: "#29bf12", message: "joined the server!" },
  { color: "#968b8b", message: "left the server" },
  { color: "#ff9914", message: "has been kicked" },
  { color: "#d92121", message: "has been banned" }
];
@Component({ components: { AvatarImage } })
export default class ActionMessageTemplate extends Vue {
  @Prop() private message!: Message & { grouped: boolean };

  get type() {
    return types[this.message.type || 0];
  }
  get time() {
    return friendlyTime(this.message.created);
  }
}
</script>
<style lang="scss" scoped>
.actionMessage {
  display: flex;
  flex-shrink: 0;
  margin: 10px;
}

.avatar {
  margin-right: 10px;
}
.message {
  text-align: center;
}
.time {
  opacity: 0.8;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
}
</style>
