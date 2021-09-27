<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="profile-popout">
      <div class="content animate-in">
        <div class="top">
          <div
            class="material-icons back-button"
            @click="close"
            :title="$t('back')"
          >
            arrow_back
          </div>
          <img class="banner" v-if="bannerURL" :src="bannerURL" />
          <div class="avatar-area">
            <AvatarImage
              :imageId="user.avatar"
              :seedId="user.id"
              :animateGif="true"
              :badges="user.badges"
              size="80px"
              class="avatar"
            />
          </div>
        </div>
        <div class="details">
          <div class="left">
            <div class="user">
              <span class="username">{{ user.username }}</span>
              <span class="tag">:{{ user.tag }}</span>
            </div>
            <div class="name" v-if="aboutMe && aboutMe.name">
              {{ aboutMe.name }}
            </div>
            <div class="custom-status">
              <UserStatusTemplate :showOffline="true" :id="user.id" />
            </div>
          </div>
          <div class="right">
            <div class="button" @click="sendMessageButton" v-if="!isMe">
              <div class="material-icons">message</div>
              {{ $t("profile-popout.send-message") }}
            </div>
            <div
              class="button"
              v-if="!isMe && !user.bot && friendStatus === undefined"
              @click="addFriend"
            >
              <div class="material-icons">person_add</div>
              {{ $t("profile-popout.add-friend") }}
            </div>
            <div
              class="button warn"
              v-if="friendStatus === 0"
              @click="cancelOrDecline"
            >
              <div class="material-icons">person_add_disabled</div>
              {{ $t("profile-popout.cancel-request") }}
            </div>
            <div class="button" v-if="friendStatus === 1" @click="acceptFriend">
              <div class="material-icons">check</div>
              {{ $t("profile-popout.accept-request") }}
            </div>
            <div
              class="button alert"
              v-if="friendStatus === 2"
              @click="cancelOrDecline"
            >
              <div class="material-icons">person_add_disabled</div>
              {{ $t("profile-popout.remove-friend") }}
            </div>
            <div class="button alert" v-if="!isMe" @click="blockUser">
              <div class="material-icons">block</div>
              {{ isBlocked ? "Unblock" : "Block" }}
            </div>
          </div>
        </div>

        <div class="other-details animate-in" v-if="returnedUser">
          <SafeHtml
            v-if="returnedUser.user.htmlProfile"
            :zippedJsonHtml="returnedUser.user.htmlProfile"
          />
          <Badges v-if="badgesArr.length" :badges="badgesArr" />
          <CommonServers
            v-if="!isMe && commonServers.length"
            :servers="commonServers"
          />
          <CommonFriends
            v-if="!isMe && commonFriends.length"
            :friends="commonFriends"
          />
          <div class="about detail-item" v-if="aboutMe && aboutMe.about_me">
            <div class="icon material-icons">info_outline</div>
            <span class="full-details"
              ><Markup :largeEmoji="false" :text="aboutMe.about_me"
            /></span>
          </div>
          <div
            class="location detail-item"
            v-if="aboutMe && (aboutMe.continent || aboutMe.country)"
          >
            <div class="icon material-icons">location_on</div>
            <span>{{ aboutMe.continent }}</span>
            <span v-if="aboutMe.country">, {{ aboutMe.country }}</span>
          </div>
          <div class="gender detail-item" v-if="aboutMe && ageAndGender">
            <div class="icon material-icons">face</div>
            <span>{{ ageAndGender }}</span>
          </div>

          <div
            class="bot-creator detail-item"
            v-if="user.bot && returnedUser.user.createdBy"
          >
            <div class="icon material-icons">person</div>
            <span>
              <span>Created By </span>
              <span class="dim" @click="botCreatorClicked">{{
                returnedUser.user.createdBy.username
              }}</span>
            </span>
          </div>

          <div class="joined detail-item" v-if="joinedAt">
            <div class="icon material-icons">event_note</div>
            <span
              >{{ $t("profile-popout.joined-at") }}
              <span class="dim">{{ joinedAt }}</span></span
            >
          </div>

          <div
            class="suspend detail-item"
            v-if="aboutMe && aboutMe['Suspend Reason']"
          >
            <div class="icon material-icons">block</div>
            <span
              >{{ $t("profile-popout.suspended") }}
              <span class="dim">{{ aboutMe["Suspend Reason"] }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import Markup from "@/components/Markup";
import CommonServers from "./CommonServers.vue";
import CommonFriends from "./CommonFriends.vue";
import Badges from "./Badges.vue";
import { PresencesModule } from "@/store/modules/presences";
import userStatuses from "@/constants/userStatuses";

import {
  blockUser,
  fetchUser,
  ReturnedUser,
  UnblockUser,
} from "@/services/userService";
import { UsersModule } from "@/store/modules/users";
import friendlyDate from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import { FriendsModule } from "@/store/modules/friends";
import {
  acceptRequest,
  deleteFriend,
  sendFriendRequest,
} from "@/services/relationshipService";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import Server from "@/interfaces/Server";
import { ServersModule } from "@/store/modules/servers";
import User from "@/interfaces/User";
import { getBadges } from "@/constants/badges";
import { defineAsyncComponent, PropType } from "vue";
import { defineComponent } from "vue";
const SafeHtml = defineAsyncComponent(
  () => import("@/components/SafeHtml.vue")
);
export default defineComponent({
  name: "ProfilePopout",
  components: {
    AvatarImage,
    Markup,
    UserStatusTemplate,
    CommonServers,
    CommonFriends,
    Badges,
    SafeHtml,
  },
  props: {
    data: {
      type: Object as PropType<{ id: string; fullProfile?: ReturnedUser }>,
      required: true,
    },
  },
  data() {
    return {
      returnedUser: null as ReturnedUser | null,
    };
  },
  computed: {
    bannerURL(): any {
      if (!this.user.banner) return null;
      return process.env.VUE_APP_NERTIVIA_CDN + this.user.banner;
    },
    joinedAt(): any {
      if (!this.returnedUser) return undefined;
      return friendlyDate(
        this.returnedUser?.user.created || 0,
        localStorage["timeFormat"]
      );
    },
    badgesArr(): any {
      const flags = (this.user as any).badges;
      if (!flags) return [];
      return getBadges(flags);
    },
    ageAndGender(): any {
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
    },
    presence(): any {
      if (!this.user?.id) return userStatuses[0];
      const presence = PresencesModule.getPresence(this.user.id);
      return userStatuses[presence || 0];
    },
    customStatus(): any {
      if (this.presence.name === "Offline") return undefined;
      return CustomStatusesModule.customStatus[this.user.id];
    },
    friendStatus(): any {
      const status = FriendsModule.friends[this.user.id]?.status;
      return status;
    },
    user(): any {
      if (!this.returnedUser) {
        return UsersModule.users[this.data.id] || {};
      }
      return this.returnedUser.user;
    },
    aboutMe(): any {
      return this.returnedUser?.user.about_me;
    },
    isMe(): any {
      return this.user.id === MeModule.user.id;
    },
    isBlocked(): any {
      return UsersModule.blockedUserIDArr.includes(this.user.id);
    },
    commonServers(): any {
      const commonServers = this.returnedUser?.commonServersArr;
      if (!commonServers) return [];
      const servers: Server[] = [];
      for (let i = 0; i < commonServers.length; i++) {
        const serverID = commonServers[i];
        if (!ServersModule.servers[serverID]) continue;
        servers.push(ServersModule.servers[serverID]);
      }
      return servers;
    },
    commonFriends(): any {
      const commonFriends = this.returnedUser?.commonFriendsArr;
      if (!commonFriends) return [];
      const friends: User[] = [];
      for (let i = 0; i < commonFriends.length; i++) {
        const friendID = commonFriends[i];
        const friend = FriendsModule.friendWithUser(friendID);
        if (!friend?.recipient) continue;
        friends.push(friend.recipient);
      }
      return friends;
    },
  },
  mounted() {
    this.returnedUser = this.data.fullProfile || null;
    if (this.returnedUser) {
      return;
    }
    fetchUser(this.data.id).then((user) => {
      this.returnedUser = user;
    });
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("profile");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
    blockUser() {
      if (this.isBlocked) {
        UnblockUser(this.user.id);
      } else {
        blockUser(this.user.id);
      }
    },
    sendMessageButton() {
      ChannelsModule.LoadDmChannel(this.user.id);
      PopoutsModule.ClosePopout("profile");
    },
    cancelOrDecline() {
      deleteFriend(this.user.id);
    },
    acceptFriend() {
      acceptRequest(this.user.id);
    },
    addFriend() {
      sendFriendRequest(this.user.username, this.user.tag);
    },
    botCreatorClicked() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.returnedUser?.user.createdBy?.id },
        key: this.returnedUser?.user.createdBy?.id,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.profile-popout {
  display: flex;
  background: var(--popout-color);
  border-radius: 4px;
  width: 500px;
  height: 600px;
  overflow: hidden;
}
.full-details {
  line-height: 1.3rem;
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
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
}
.banner {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
  position: relative;
  z-index: 1;
}
.avatar-area {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 2;

  top: 89px;
  left: 20px;
}
.details {
  display: flex;
  border-bottom: solid 1px rgba(255, 255, 255, 0.2);
  padding-bottom: 5px;
  flex-shrink: 0;
  .left {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    flex: 1;
    .user {
      margin-left: 20px;
      margin-top: 10px;
      font-size: 18px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .tag {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
    .username {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name {
      color: rgba(255, 255, 255, 0.4);
      margin-left: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
  margin-top: 5px;
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
  .bot-creator,
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
  .bot-creator {
    .material-icons {
      color: rgb(255, 206, 73);
    }
    .dim {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
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
  z-index: 111111111;
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
.profile-popout .status-name {
  white-space: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
}
</style>
