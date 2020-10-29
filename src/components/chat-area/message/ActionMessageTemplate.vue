<template>
  <div class="actionMessage">
    <AvatarImage
      class="avatar"
      :imageId="message.creator.avatar"
      :seedId="message.creator.uniqueID"
      :animateGif="false"
      :willHaveClickEvent="true"
      size="40px"
      @click.native="showProfile"
    />
    <div class="details">
      <div class="message">
        <span class="username" @click="showProfile">{{
          message.creator.username
        }}</span
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
import { PopoutsModule } from "@/store/modules/popouts";

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

  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.message.creator.uniqueID }
    });
  }

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
.username {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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
