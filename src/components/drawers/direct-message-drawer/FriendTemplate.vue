<template>
  <div class="friend">
    <div
      class="wrapper"
      :class="{ selected: isFriendSelected, hasNotification: notification }"
      @click="clickedEvent"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <AvatarImage
        class="avatar"
        v-if="user"
        :imageId="user.avatar"
        :seedId="user.id"
        size="30px"
        :willHaveClickEvent="true"
        :animateGif="hover"
        @click="showProfile"
      />
      <div class="details" v-if="user">
        <div class="username">{{ user.username }}</div>
        <UserStatusTemplate :showStatusOnly="hover" :id="user.id" />
      </div>
      <div class="notification" v-if="notification">
        {{ notification.count > 99 ? "99" : notification.count }}
      </div>
      <div
        class="material-icons icon close-button"
        v-else-if="dmChannel"
        title="Hide"
        @click="hide"
      >
        close
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import Channel from "@/interfaces/Channel";
import User from "@/interfaces/User";
import { hideDMChannel } from "@/services/channelService";
import { ChannelsModule } from "@/store/modules/channels";
import { DrawersModule } from "@/store/modules/drawers";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import { MessagesModule } from "@/store/modules/messages";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "FriendTemplate",
  components: { AvatarImage, UserStatusTemplate },
  props: {
    friend: {
      type: Object as PropType<{ recipient: User; status: number }>,
      required: false,
    },
    dmChannel: {
      type: Object as PropType<Channel & { recipients: User[] }>,
      required: false,
    },
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    user(): any {
      if (this.friend) {
        return this.friend.recipient || this.friend;
      } else {
        return this.dmChannel?.recipients[0];
      }
    },
    isFriendSelected(): any {
      const channel = ChannelsModule.getDMChannel(
        this.$route.params.channel_id as string
      );
      if (!channel) return undefined;
      if (!channel.recipients) return undefined;
      return channel.recipients[0].id === this.user?.id;
    },
    notification(): any {
      if (!this.user) return false;
      return NotificationsModule.notificationByUserID(this.user.id);
    },
  },
  methods: {
    clickedEvent(event: any) {
      DrawersModule.SetLeftDrawer(false);
      if (
        !event.target.closest(".avatar") &&
        !event.target.closest(".close-button")
      ) {
        if (!this.user) return;
        ChannelsModule.LoadDmChannel(this.user.id);
      }
    },
    hide() {
      if (!this.dmChannel) return;
      if (this.isFriendSelected) {
        this.$router.push("/app/dms");
      }
      hideDMChannel(this.dmChannel.channelId).then(() => {
        if (!this.dmChannel) return;
        ChannelsModule.RemoveChannel(this.dmChannel.channelId);
        MessagesModule.DeleteChannelMessages(this.dmChannel.channelId);
        MessageLogStatesModule.RemoveState(this.dmChannel.channelId);
      });
    },
    showProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.user?.id },
      });
    },
  },
});
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
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    transition: 0.1s;
    border-radius: 4px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 0.4;
    }
    .icon {
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }
  }

  &.selected {
    background: rgba(255, 255, 255, 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 1;
    }
    .icon {
      opacity: 0.6;
    }
    .username {
      color: white;
    }
  }
  &.hasNotification {
    &:before {
      background: var(--alert-color);
    }
  }
}
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.6);
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
.details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.icon {
  font-size: 16px;
  margin-right: 10px;
  flex-shrink: 0;
  opacity: 0;
  transition: 0.2s;
}
</style>
