<template>
  <div class="friend">
    <div
      class="wrapper"
      @click="clickedEvent"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="inner-content">
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
          <div class="status">
            <div class="name">
              {{ friend.status === 1 ? "Incoming" : "Request Sent" }}
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <CustomButton
          v-if="friend.status === 0"
          @click="cancelOrDecline"
          :filled="true"
          name="Cancel"
          :valid="true"
          :warn="true"
        />
        <CustomButton
          v-if="friend.status === 1"
          @click="acceptFriend"
          :filled="true"
          name="Accept"
          :valid="true"
        />
        <CustomButton
          v-if="friend.status === 1"
          @click="cancelOrDecline"
          :filled="true"
          name="Decline"
          :warn="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import User from "@/interfaces/User";
import { acceptRequest, deleteFriend } from "@/services/relationshipService";
import { ChannelsModule } from "@/store/modules/channels";
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";

import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { AvatarImage, CustomButton } })
export default class FriendTemplate extends Vue {
  @Prop() private friend!: { recipient: User; status: number };
  @Prop() private dmChannel!: { recipients: User[] };
  hover = false;
  clickedEvent(event: any) {
    if (!event.target.closest(".avatar") && !event.target.closest(".button")) {
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
  cancelOrDecline() {
    deleteFriend(this.user.uniqueID);
  }
  acceptFriend() {
    acceptRequest(this.user.uniqueID);
  }
  get user() {
    if (this.friend) {
      return this.friend.recipient || this.friend;
    } else {
      return this.dmChannel.recipients[0];
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  height: 80px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  margin: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.2s;
}
.inner-content {
  display: flex;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  margin-top: 5px;
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
.status {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 14px;
  .name {
    opacity: 0.8;
  }
}
.buttons {
  display: flex;
  margin-top: 5px;
  flex-shrink: 0;
}
.button {
  flex: 1;
  padding: 4px !important;
}
</style>
