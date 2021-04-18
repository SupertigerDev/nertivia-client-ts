<template>
  <div class="nav-bar" :class="{ show: leftDrawerOpened }">
    <div
      class="item"
      :class="{
        selected: currentTab === ''
      }"
      :title="$t('dashboard-tab.dashboard')"
      @click="changeTab('')"
    >
      <div class="icon material-icons">dashboard</div>
      <div class="title">Dashboard</div>
    </div>

    <div
      class="item"
      :class="{
        selected: currentTab === 'explore'
      }"
      :title="$t('dashboard-tab.explore')"
      @click="changeTab('explore')"
    >
      <div class="icon material-icons">explore</div>
      <div class="title">Explore</div>
    </div>

    <div
      class="item"
      :class="{
        selected: currentTab === 'dms',
        notification: dmNotificationExists
      }"
      :title="$t('dashboard-tab.direct-messages')"
      @click="changeTab('dms')"
    >
      <div class="icon material-icons">forum</div>
      <div class="title">DMs</div>
    </div>
    <div
      class="item"
      :class="{
        selected: currentTab === 'servers',
        notification: serverNotificationExists,
        mentioned: serverMentioned
      }"
      :title="$t('dashboard-tab.servers')"
      @click="changeTab('servers')"
    >
      <div class="icon material-icons">dns</div>
      <div class="title">Servers</div>
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
    <div
      class="item me"
      :class="{ selected: showUserArea }"
      :title="me.username"
      @click="showUserArea = !showUserArea"
    >
      <div class="status-dot" :style="{ backgroundColor: presence.color }" />
      <AvatarImage
        class="avatar"
        size="25px"
        :image-id="me.avatar"
        :seed-id="me.id"
      />
    </div>

    <div
      class="item last"
      :class="{
        selected: currentTab === 'settings'
      }"
      title="Settings"
      @click="changeTab('settings')"
    >
      <div class="icon material-icons">settings</div>
      <div class="title">Settings</div>
    </div>

    <!-- Popouts -->
    <UserArea
      class="user-area"
      v-if="showUserArea"
      v-click-outside="clickOutsideUserArea"
    />
  </div>
</template>

<script lang="ts">
const AvatarImage = () =>
  import(/* webpackChunkName: "AvatarImage" */ "@/components/AvatarImage.vue");
const UserArea = () =>
  import(
    /* webpackChunkName: "UserArea" */ "@/components/popouts/UserArea.vue"
  );
import userStatuses from "@/constants/userStatuses";
import { AppUpdateModule } from "@/store/modules/appUpdate";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MeModule } from "@/store/modules/me";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import { PresencesModule } from "@/store/modules/presences";
import { lastSelectedServerChannel } from "@/utils/lastSelectedServer";
import { Component, Vue } from "vue-property-decorator";

@Component({ components: { AvatarImage, UserArea } })
export default class NavBar extends Vue {
  showUserArea = false;
  clickOutsideUserArea(event: any) {
    if (event.target.closest(".item.me")) return;
    if (event.target.closest(".context")) return;
    this.showUserArea = false;
  }

  changeTab(name: string) {
    const selectedServerID = this.lastSelectedServerID();
    const serverChannelID = lastSelectedServerChannel(selectedServerID || "");

    const selectedDmChannelId = this.lastSelectedDMChannelID();
    let path = name;
    if (this.currentTab === name) return;
    if (name === "servers" && selectedServerID && serverChannelID) {
      path += `/${selectedServerID}/${serverChannelID}`;
    }
    if (name === "dms" && selectedDmChannelId) {
      path += `/${selectedDmChannelId}`;
    }
    this.$router.push("/app/" + path);
  }
  updateAvailableClick() {
    PopoutsModule.ShowPopout({
      id: "update-popout",
      component: "UpdatePopout"
    });
  }
  lastSelectedServerID(): string | null {
    return localStorage.getItem("lastSelectedServerID");
  }
  lastSelectedDMChannelID(): string | null {
    return localStorage.getItem("lastSelectedDMChannelID");
  }
  get currentTab() {
    return this.$route.path.split("/")[2] || "";
  }
  get me() {
    return MeModule.user;
  }
  get serverMentioned() {
    return LastSeenServerChannelsModule.allServerNotifications.find(
      c => c.mentioned
    );
  }
  get serverNotificationExists() {
    return LastSeenServerChannelsModule.allServerNotifications.length > 0;
  }
  get dmNotificationExists() {
    return NotificationsModule.allDMNotifications.length > 0;
  }
  get presence() {
    if (!this.me?.id || !MeModule.connected) return userStatuses[0];
    const presence = PresencesModule.getPresence(this.me.id);
    return userStatuses[presence || 0];
  }
  get leftDrawerOpened() {
    return DrawersModule.leftDrawer;
  }
  get updateAvailable() {
    return AppUpdateModule.updateAvailable;
  }
}
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
    font-size: 12px;
    display: none;
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
  &.me.selected {
    background-color: transparent;
    transform: scale(1.3);
  }
  &.notification {
    &::before {
      content: "";
      color: white;
      position: absolute;
      bottom: 10px;
      right: 13px;
      background-color: var(--alert-color);
      border-radius: 50%;
      height: 10px;
      width: 10px;
    }
    &.mentioned::before {
      content: "@";
      display: flex;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      color: white;
      align-items: center;
      align-content: center;
      justify-content: center;
      font-size: 12px;
      width: 20px;
      height: 20px;
      bottom: 5px;
      right: 10px;
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
    .icon {
      font-size: 19px;
      margin-bottom: 3px;
    }
    &.notification {
      &::before {
        bottom: 20px;
        right: 15px;
      }
      &.mentioned::before {
        right: 13px;
        bottom: 17px;
        font-size: 10px;
        height: 15px;
        width: 15px;
      }
    }
  }
  .item .title {
    display: block;
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
  bottom: 10px;
  right: 10px;
  z-index: 1;
}
</style>
