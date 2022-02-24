<template>
  <div
    class="nav-bar"
    :class="{
      show: leftDrawerOpened || pinned,
      'pin-bottom': pinned && !leftDrawerOpened,
    }"
  >
    <div
      class="item"
      :class="{
        selected: currentTab === '',
      }"
      :title="$t('dashboard-tab.dashboard')"
      @click="changeTab('')"
    >
      <div class="icon material-icons">dashboard</div>
      <div class="title">{{ $t("dashboard-tab.dashboard") }}</div>
    </div>

    <div
      class="item"
      :class="{
        selected: currentTab === 'explore',
      }"
      :title="$t('dashboard-tab.explore')"
      @click="changeTab('explore')"
    >
      <div class="icon material-icons">explore</div>
      <div class="title">{{ $t("dashboard-tab.explore") }}</div>
    </div>

    <div
      class="item"
      :class="{
        selected: currentTab === 'dms',
        notification: dmNotificationExists || friendRequestExists,
      }"
      :title="$t('dashboard-tab.direct-messages')"
      @click="changeTab('dms')"
    >
      <div class="icon material-icons">forum</div>
      <div class="title">{{ $t("dashboard-tab.direct-messages") }}</div>
    </div>
    <div
      class="item"
      :class="{
        selected: currentTab === 'servers',
        notification: serverNotificationExists,
        mentioned: serverMentioned,
      }"
      :title="$t('dashboard-tab.servers')"
      @click="changeTab('servers')"
    >
      <div class="icon material-icons">dns</div>
      <div class="title">{{ $t("dashboard-tab.servers") }}</div>
    </div>
    <div
      class="item"
      :class="{
        selected: currentTab === 'admin-panel',
      }"
      v-if="isAdmin"
      title="Admin Panel"
      @click="changeTab('admin-panel')"
    >
      <div class="icon material-icons">security</div>
      <div class="title">Admin Panel</div>
    </div>
    <div
      class="item update"
      v-if="updateAvailable"
      :title="$t('navbar.update-available')"
      @click="updateAvailableClick"
    >
      <div class="icon material-icons">download</div>
      <div class="title">{{ $t("navbar.update") }}</div>
    </div>

    <div class="gap" />
    <NavBarInCall v-if="isInCall && !isMobileWidth" />
    <div
      class="item me"
      :class="{ selected: isProfileOpened }"
      :title="me.username"
      @click="showCardPopup"
    >
      <div class="status-dot" :style="{ backgroundColor: presence.color }" />
      <AvatarImage class="avatar" size="25px" :image-id="me.avatar" :seed-id="me.id" />
      <div class="title">{{ me.username }}</div>
    </div>

    <div
      v-if="showSettings"
      class="item last"
      :class="{
        selected: currentTab === 'settings',
      }"
      title="Settings"
      @click="changeTab('settings')"
    >
      <div class="icon material-icons">settings</div>
      <div class="title">Settings</div>
    </div>
  </div>
</template>

<script lang="ts">
import userStatuses from "@/constants/userStatuses";
import { AppUpdateModule } from "@/store/modules/appUpdate";
import { DrawersModule } from "@/store/modules/drawers";
import { FriendsModule, FriendStatus } from "@/store/modules/friends";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import { MeModule } from "@/store/modules/me";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import { PresencesModule } from "@/store/modules/presences";
import { ReactiveLocalStorageModule } from "@/store/modules/reactiveLocalStorage";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { useWindowProperties } from "@/utils/windowProperties";
import { defineComponent, defineAsyncComponent } from "vue";
const AvatarImage = defineAsyncComponent(
  () => import("@/components/AvatarImage.vue")
);
const NavBarInCall = defineAsyncComponent(
  () => import("@/components/NavBarInCall.vue")
);
export default defineComponent({
  name: "NavBar",
  components: { AvatarImage, NavBarInCall },
  computed: {
    isInCall() {
      return voiceChannelModule.joinedchannelId;
    },
    isMobileWidth() {
      return useWindowProperties().isMobileWidth;
    },
    showSettings(): any {
      return ReactiveLocalStorageModule.getStore("showSettingsInNavigation");
    },
    currentTab(): any {
      return this.$route.path.split("/")[2] || "";
    },
    me(): any {
      return MeModule.user;
    },
    isAdmin(): any {
      return this.me.type === "CREATOR" || this.me.type === "ADMIN";
    },
    serverMentioned(): any {
      return LastSeenServerChannelsModule.allServerNotifications.find(
        (c) => c.mentioned
      );
    },
    serverNotificationExists(): any {
      return LastSeenServerChannelsModule.allServerNotifications.length > 0;
    },
    dmNotificationExists(): any {
      return NotificationsModule.allDMNotifications.length > 0;
    },
    friendRequestExists(): any {
      return this.friends.find((f) => f.status === FriendStatus.PENDING);
    },
    friends(): any {
      return FriendsModule.friendsWithUser;
    },
    presence(): any {
      if (!this.me?.id || !MeModule.connected) return userStatuses[0];
      const presence = PresencesModule.getPresence(this.me.id);
      return userStatuses[presence || 0];
    },
    pinned(): any {
      const routeName = this.$route.name as string;
      return !routeName?.endsWith("message-area");
    },
    leftDrawerOpened(): any {
      return DrawersModule.leftDrawer;
    },
    updateAvailable(): any {
      return AppUpdateModule.updateAvailable;
    },
    isProfileOpened(): any {
      return PopoutsModule.isOpened("floating-profile-card");
    },
  },
  methods: {
    changeTab(name: string) {
      const selectedServerID = this.lastSelectedServerID();
      const serverchannelId = LastSelectedServersModule.lastServerchannelId(
        selectedServerID || ""
      );

      const selectedDmchannelId = this.lastSelectedDMchannelId();
      let path = name;
      if (this.currentTab === name) return;
      if (name === "servers" && selectedServerID && serverchannelId) {
        path += `/${selectedServerID}/${serverchannelId}`;
      }
      if (name === "dms" && selectedDmchannelId) {
        path += `/${selectedDmchannelId}`;
      }
      this.$router.push("/app/" + path);
    },
    updateAvailableClick() {
      PopoutsModule.ShowPopout({
        id: "update-popout",
        component: "UpdatePopout",
      });
    },
    lastSelectedServerID(): string | null {
      return localStorage.getItem("lastSelectedServerID");
    },
    lastSelectedDMchannelId(): string | null {
      return localStorage.getItem("lastSelectedDMchannelId");
    },
    showCardPopup() {
      PopoutsModule.ShowPopout({
        id: "floating-profile-card",
        component: "FloatingProfileCard",
        toggle: true,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-direction: column;
  width: 60px;
  align-items: center;
  flex-shrink: 0;
  padding-bottom: 3px;
}
.gap {
  flex: 1;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 50px;
  margin-top: 3px;
  width: 50px;
  cursor: pointer;
  user-select: none;
  opacity: 0.6;
  z-index: 1111111;
  transition: 0.2s;
  border-radius: 0;
  position: relative;
  .title {
    font-size: 9px;
    text-align: center;
    margin-top: 3px;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &:hover {
    opacity: 1;
  }

  &.selected {
    border-radius: 4px;
    opacity: 1;
    background-color: var(--primary-color);
  }
  &.update {
    border-radius: 4px;
    background: var(--success-color);
  }
  &.me {
    height: initial;
  }
  &.me.selected {
    background-color: transparent;
    transform: scale(1.3);
  }
  &.notification {
    &::before {
      content: "";
      color: white;
      position: absolute;
      bottom: 18px;
      right: 13px;
      background-color: var(--alert-color);
      border-radius: 50%;
      height: 10px;
      width: 10px;
    }
    &.mentioned::before {
      content: "@";
      display: flex;
      color: white;
      align-items: center;
      align-content: center;
      justify-content: center;

      right: 13px;
      bottom: 17px;
      font-size: 10px;
      height: 15px;
      width: 15px;
    }
  }
}
.user-area-button {
  opacity: 1;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
.user-area {
  position: absolute;
  left: 60px;
  bottom: 53px;
  z-index: 11111112111;
}
@media (max-width: 950px) {
  .nav-bar {
    position: fixed;
    bottom: -56px;
    left: 0;
    right: 0;
    height: 50px;
    width: 100%;
    flex-direction: row;
    padding-top: 0;
    overflow: hidden;
    padding-bottom: 0;
    padding-top: 3px;
    padding-bottom: 3px;

    transition: 0.2s;

    &.pin-bottom {
      position: initial;
      background: rgba(0, 0, 0, 0.2);
    }
    &.show {
      bottom: 0px;
    }
  }

  .item {
    height: 100%;
    padding-left: 3px;
    padding-right: 3px;
    width: initial;
    min-width: 50px;
    margin: 0px;
    margin-right: 3px;
    &.notification {
      &::before {
        bottom: 20px;
        right: 15px;
      }
    }
  }
  .user-area {
    bottom: 60px;
    right: 5px;
    left: initial;
  }
  .item:first-child {
    margin-left: 3px;
  }
  .item.last {
    margin: 3px;
    flex-shrink: 0;
  }
}

.status-dot {
  border-radius: 50%;
  height: 10px;
  width: 10px;
  position: absolute;
  margin-left: 17px;
  margin-top: 10px;
  z-index: 1;
}
</style>
