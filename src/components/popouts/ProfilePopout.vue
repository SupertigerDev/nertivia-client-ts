<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="profile-popout">
      <div class="content animate-in">
        <div class="top">
          <div class="material-icons back-button" @click="close" title="Back">
            arrow_back
          </div>
          <img class="banner" v-if="banner" :src="banner" />
          <input
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            style="display: none"
            ref="browseBanner"
            @change="fileSelected"
          />
          <div class="link-button" @click="$refs.browseBanner.click()">
            Click To Test Banner (WIP)
          </div>
          <div class="avatar-area">
            <AvatarImage
              :imageId="user.avatar"
              :seedId="user.uniqueID"
              :animateGif="true"
              size="80px"
              class="avatar"
            />
            <div class="user">
              <span class="username">{{ user.username }}</span>
              <span class="tag">:{{ user.tag }}</span>
            </div>
          </div>
        </div>
        <div class="details">
          <div class="left">
            <div class="custom-status">
              <UserStatusTemplate :uniqueID="user.uniqueID" />
            </div>
          </div>
          <div class="right">
            <div class="button" @click="sendMessageButton">
              <div class="material-icons">message</div>
              Send Message
            </div>
            <div
              class="button"
              v-if="!user.bot && friendStatus === undefined"
              @click="addFriend"
            >
              <div class="material-icons">person_add</div>
              Add Friend
            </div>
            <div
              class="button warn"
              v-if="friendStatus === 0"
              @click="cancelOrDecline"
            >
              <div class="material-icons">person_add_disabled</div>
              Cancel Request
            </div>
            <div class="button" v-if="friendStatus === 1" @click="acceptFriend">
              <div class="material-icons">check</div>
              Accept Request
            </div>
            <div
              class="button alert"
              v-if="friendStatus === 2"
              @click="cancelOrDecline"
            >
              <div class="material-icons">person_add_disabled</div>
              Remove Friend
            </div>
            <div class="button alert">
              <div class="material-icons">block</div>
              Block
            </div>
          </div>
        </div>

        <div class="other-details animate-in" v-if="returnedUser">
          <div class="about detail-item" v-if="aboutMe && aboutMe.about_me">
            <div class="icon material-icons">info_outline</div>
            <span><Markup :text="aboutMe.about_me"/></span>
          </div>
          <div
            class="location detail-item"
            v-if="aboutMe && (aboutMe.continent || aboutMe.country)"
          >
            <div class="icon material-icons">location_on</div>
            <span>{{ aboutMe.country || aboutMe.continent }}</span>
          </div>
          <div class="gender detail-item" v-if="aboutMe && ageAndGender">
            <div class="icon material-icons">face</div>
            <span>{{ ageAndGender }}</span>
          </div>
          <div class="joined detail-item" v-if="joiendAt">
            <div class="icon material-icons">event_note</div>
            <span
              >Joined <span class="dim">{{ joiendAt }}</span></span
            >
          </div>
          <div
            class="suspend detail-item"
            v-if="aboutMe && aboutMe['Suspend Reason']"
          >
            <div class="icon material-icons">block</div>
            <span
              >Suspended
              <span class="dim">{{ aboutMe["Suspend Reason"] }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import Markup from "@/components/Markup.vue";
import { PresencesModule } from "@/store/modules/presences";
import userStatuses from "@/constants/userStatuses";
import { fetchUser, ReturnedUser } from "@/services/userService";
import { UsersModule } from "@/store/modules/users";
import friendlyDate from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import { FriendsModule } from "@/store/modules/friends";
import {
  acceptRequest,
  deleteFriend,
  sendFriendRequest
} from "@/services/relationshipService";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { ChannelsModule } from "@/store/modules/channels";
@Component({
  components: { AvatarImage, Markup, UserStatusTemplate }
})
export default class ProfilePopout extends Vue {
  @Prop() private data!: { uniqueID: string };
  banner: any = null;
  returnedUser: ReturnedUser | null = null;
  close() {
    PopoutsModule.ClosePopout("profile");
  }
  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      this.close();
    }
  }
  fileSelected(event: any) {
    const file = event.target.files[0];
    event.target.value = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.banner = reader.result;
    };
  }
  sendMessageButton() {
    ChannelsModule.LoadDmChannel(this.user.uniqueID);
    PopoutsModule.ClosePopout("profile");
  }
  cancelOrDecline() {
    deleteFriend(this.user.uniqueID);
  }
  acceptFriend() {
    acceptRequest(this.user.uniqueID);
  }
  addFriend() {
    sendFriendRequest(this.user.username, this.user.tag);
  }

  mounted() {
    fetchUser(this.data.uniqueID).then(user => {
      this.returnedUser = user;
    });
  }

  get joiendAt() {
    if (!this.returnedUser) return undefined;
    return friendlyDate(this.returnedUser?.user.created || 0);
  }

  get ageAndGender() {
    let finalText = "";
    if (this.aboutMe?.gender && this.aboutMe.gender !== "Rather not say") {
      finalText = this.aboutMe.gender;
    }
    if (this.aboutMe?.age && this.aboutMe.age !== "Rather not say") {
      if (finalText) {
        finalText += ", ";
      }
      finalText += this.aboutMe.age;
    }
    return finalText;
  }

  get presence() {
    if (!this.user?.uniqueID) return userStatuses[0];
    const presence = PresencesModule.getPresence(this.user.uniqueID);
    return userStatuses[presence || 0];
  }
  get customStatus() {
    if (this.presence.name === "Offline") return undefined;
    return CustomStatusesModule.customStatus[this.user.uniqueID];
  }
  get friendStatus() {
    const status = FriendsModule.friends[this.user.uniqueID]?.status;
    return status;
  }
  get user() {
    if (!this.returnedUser) {
      return UsersModule.users[this.data.uniqueID] || {};
    }
    return this.returnedUser.user;
  }
  get aboutMe() {
    return this.returnedUser?.user.about_me;
  }
}
</script>
<style lang="scss" scoped>
.profile-popout {
  display: flex;
  background: var(--popout-color);
  border-radius: 8px;
  width: 500px;
  height: 600px;
  overflow: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.top {
  background: var(--primary-color);
  width: 100%;
  height: 150px;
  border-radius: 8px;
  position: relative;
  flex-shrink: 0;
}
.banner {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  position: relative;
  z-index: 1;
}
.avatar-area {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 2;

  bottom: -50px;
  left: 20px;
  .user {
    margin-top: 10px;
    font-size: 18px;
  }
  .tag {
    font-size: 16px;
    opacity: 0.7;
  }
}
.details {
  display: flex;
  border-bottom: solid 1px rgba(255, 255, 255, 0.2);
  padding-bottom: 5px;
  flex-shrink: 0;
  .left {
    display: flex;
    margin-top: 60px;
    position: relative;
    flex: 1;
  }
  .right {
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    margin-right: 20px;
    flex-shrink: 0;
  }
}
.custom-status {
  display: flex;
  align-items: center;
  border-radius: 12px;
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.1);
  align-self: flex-start;
  padding: 4px;
  padding-left: 6px;
  padding-right: 8px;
  .dot {
    background: green;
    height: 10px;
    flex-shrink: 0;
    margin-right: 8px;
    border-radius: 50%;
    width: 10px;
  }
  .name {
    line-break: anywhere;
  }
}
.button {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  align-self: flex-end;
  border-radius: 4px;
  font-size: 14px;
  padding: 5px;
  margin: 4px;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.8;
  user-select: none;
  &.alert {
    &:hover {
      background: var(--alert-color);
      opacity: 1;
    }
  }
  &.warn {
    &:hover {
      opacity: 1;
      background: var(--warn-color);
    }
  }
  &:hover {
    opacity: 1;
    background: var(--primary-color);
  }
  .material-icons {
    font-size: 18px;
    margin-right: 5px;
  }
  &:active {
    transform: scale(0.9);
  }
}
.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.link-button {
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 10px;
  opacity: 0.8;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
  }
}
.other-details {
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-left: 10px;
  padding: 10px;
  .location,
  .gender,
  .joined,
  .suspend,
  .about {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .material-icons {
      margin-right: 10px;
      align-self: flex-start;
      color: rgba(255, 255, 255, 0.8);
    }
    span {
      word-break: break-word;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  }
  .dim {
    color: rgba(255, 255, 255, 0.8);
  }
  .about {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
  .location {
    .material-icons {
      color: rgb(255, 73, 73);
    }
  }
  .gender {
    .material-icons {
      color: rgb(255, 206, 73);
    }
  }
  .joined {
    .material-icons {
      color: rgb(73, 131, 255);
    }
  }
  .suspend {
    .material-icons {
      color: var(--alert-color);
    }
  }
}
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  user-select: none;
  opacity: 0.7;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
.detail-item {
  flex-shrink: 0;
}
@media (max-height: 600px) {
  .profile-popout {
    height: 100%;
  }
}
@media (max-width: 400px) {
  .profile-popout {
    height: 100%;
    width: 100%;
  }
}
</style>

<style>
.profile-popout .status-name.game {
  white-space: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
}
</style>
