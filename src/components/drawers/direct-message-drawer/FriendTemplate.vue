<template>
  <div class="friend">
    <div
      class="wrapper"
      :class="{ selected: isFriendSelected }"
      @click="clickedEvent"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <AvatarImage
        class="avatar"
        :imageId="user.avatar"
        :seedId="user.uniqueID"
        size="30px"
        :willHaveClickEvent="true"
        :animateGif="hover"
        @click.native="showProfile"
      />
      <div class="details">
        <div class="username">{{ user.username }}</div>
        <div class="status" v-if="presenceDetails">
          <div class="dot" :style="{ background: presenceDetails.color }" />
          <div class="name">{{ presenceDetails.name }}</div>
        </div>
      </div>
      <div class="notification" v-if="notification">
        {{ notification.count > 99 ? "99" : notification.count }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import userStatuses from "@/constants/userStatuses";
import User from "@/interfaces/User";
import { ChannelsModule } from "@/store/modules/channels";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import { PresencesModule } from "@/store/modules/presences";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { AvatarImage } })
export default class FriendTemplate extends Vue {
  @Prop() private friend!: { recipient: User; status: number };
  @Prop() private dmChannel!: { recipients: User[] };
  hover = false;
  clickedEvent(event: any) {
    if (!event.target.closest(".avatar")) {
      ChannelsModule.LoadDmChannel(this.user.uniqueID);
    }
  }
  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.user.uniqueID }
    });
  }
  get user() {
    if (this.friend) {
      return this.friend.recipient || this.friend;
    } else {
      return this.dmChannel.recipients[0];
    }
  }
  get presenceDetails() {
    const presence = PresencesModule.getPresence(this.user.uniqueID);
    if (!presence) return undefined;
    return userStatuses[presence || 0];
  }
  get isFriendSelected() {
    const channel = ChannelsModule.getDMChannel(this.$route.params.channel_id);
    if (!channel) return undefined;
    if (!channel.recipients) return undefined;
    return channel.recipients[0].uniqueID === this.user.uniqueID;
  }
  get notification() {
    return NotificationsModule.notificationByUniqueID(this.user.uniqueID);
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  height: 40px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  margin: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: var(--primary-color);
    color: white;
  }
}
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  margin-right: 5px;
  margin-left: 5px;
}
.notification {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 20px;
  font-size: 13px;
  margin: auto;
  margin-right: 10px;
  width: 20px;
  background-color: var(--alert-color);
  border-radius: 50%;
}

.status {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 14px;
  .name {
    opacity: 0.8;
  }
  .dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 4px;
  }
}
</style>
