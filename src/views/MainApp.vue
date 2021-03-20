<template>
  <div class="app" :class="{ leftDrawerOpened: leftDrawerOpened }">
    <NavBar
      :updateAvailable="updateAvailable"
      class="nav-bar"
      v-if="!isMobileWidth || leftDrawerOpened"
    />
    <Drawers class="drawers">
      <LeftDrawer slot="drawer-left" />
      <RightDrawer
        slot="drawer-right"
        v-if="currentTab === 'servers' && currentChannelID"
      />
      <div class="content" slot="content">
        <transition name="fade" appear>
          <ConnectionStatus
            v-if="showConnectionStatusPopout"
            @close="showConnectionStatusPopout = false"
          />
        </transition>
        <router-view />
      </div>
    </Drawers>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import socketIOModule from "@/store/modules/socketIO/socketIOModule";
import { ServersModule } from "@/store/modules/servers";
import { UsersModule } from "@/store/modules/users";
import { MeModule } from "@/store/modules/me";

import ConnectionStatus from "@/components/popouts/ConnectionStatusPopout.vue";
import Header from "@/components/Header.vue";
import { getChangelog } from "@/services/updateService";
const Drawers = () =>
  import(/* webpackChunkName: "Drawers" */ "@/components/drawers/Drawers.vue");
const NavBar = () =>
  import(/* webpackChunkName: "NavBar" */ "@/components/NavBar.vue");

const LeftDrawer = () =>
  import(
    /* webpackChunkName: "LeftDrawer" */ "@/components/drawers/LeftDrawer.vue"
  );
const RightDrawer = () =>
  import(
    /* webpackChunkName: "RightDrawer" */ "@/components/drawers/RightDrawer.vue"
  );

import { loadAllCacheToState } from "@/utils/localCache";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { DrawersModule } from "@/store/modules/drawers";
import WindowProperties from "@/utils/windowProperties";
import { FriendsModule } from "@/store/modules/friends";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import electronBridge from "@/utils/electronBridge";

@Component({
  components: {
    Drawers,
    LeftDrawer,
    RightDrawer,
    NavBar,
    Header,
    ConnectionStatus
  }
})
export default class MainApp extends Vue {
  showConnectionStatusPopout = true;
  updateAvailable = false;
  checkAfter = 600000; // 60 minutes
  lastUpdateChecked = Date.now();
  mounted() {
    electronBridge?.send("notification_badge", 0);

    // set store and connect socket.
    this.$store.registerModule("socketIO", socketIOModule);
    this.$socket.client.connect();
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel("sw-messages");
      // hack to fix disconnects using service workers;
      channel.addEventListener("message", event => {
        const client = this.$socket.client;
        if (event.data !== "ping") return;
        if (WindowProperties.isFocused) return;
        if (!client.connected) return;
        client.emit("p");
      });
    }
    this.checkChangelog();
  }
  beforeMount() {
    localStorage.removeItem("lastSelectedDMChannelID");
    localStorage.removeItem("lastSelectedServer");
    this.saveLastSelected();
    this.loadCache();
  }
  async loadCache() {
    loadAllCacheToState([
      {
        storage: "me",
        state: MeModule.SetUser
      },
      {
        storage: "serverPositions",
        state: ServersModule.SetServerPositions
      },
      {
        storage: "servers",
        state: ServersModule.InitServers
      },
      {
        storage: "channels",
        state: ChannelsModule.InitChannels
      },
      {
        storage: "users",
        state: UsersModule.InitUsers
      },
      {
        storage: "friends",
        state: FriendsModule.InitFriends
      },
      {
        storage: "serverRoles",
        state: ServerRolesModule.InitServerRoles
      },
      {
        storage: "serverMembers",
        state: ServerMembersModule.InitServerMembers
      }
    ]);
  }

  beforeDestroy() {
    this.$store.unregisterModule("socketIO");
  }
  checkForUpdate() {
    if (!this.$version) return;
    if (this.updateAvailable) return;
    if (Date.now() - this.lastUpdateChecked <= this.checkAfter) return;
    this.lastUpdateChecked = Date.now();
    getChangelog().then(log => {
      const version = log[0].version;
      if (this.$version !== version) {
        this.updateAvailable = true;
      }
    });
  }
  checkChangelog() {
    const seenVersion = localStorage["changelogSeenVersion"];
    if (!seenVersion) {
      localStorage["changelogSeenVersion"] = this.$version;
      return;
    }
    if (seenVersion === this.$version) return;
    localStorage["changelogSeenVersion"] = this.$version;
    PopoutsModule.ShowPopout({
      id: "changelog-popout",
      component: "ChangelogPopout"
    });
  }
  @Watch("focused")
  onFocusChange() {
    this.checkForUpdate();
  }
  // save last selected channels
  @Watch("currentChannelID")
  @Watch("currentServerID")
  @Watch("currentTab")
  saveLastSelected() {
    this.checkForUpdate();
    if (this.$route.name !== "message-area") return;
    if (this.currentTab === "servers") {
      const json = JSON.stringify({
        server_id: this.currentServerID,
        channel_id: this.currentChannelID
      });
      localStorage.setItem("lastSelectedServer", json);
    } else if (this.currentTab === "dms" && this.currentChannelID) {
      localStorage.setItem("lastSelectedDMChannelID", this.currentChannelID);
    }
  }
  @Watch("isConnected")
  showConnectionPopout() {
    if (!this.isConnected) {
      this.showConnectionStatusPopout = true;
    }
  }
  @Watch("firstServerNotification")
  @Watch("firstDmNotification")
  onNotification() {
    if (this.$isElectron) this.setElectronBadge();
    this.setBrowserWindowTitle();
  }

  setElectronBadge() {
    if (this.firstServerNotification || this.firstDmNotification) {
      electronBridge?.send("notification_badge", 1);
      return;
    }
    electronBridge?.send("notification_badge", 0);
  }
  setBrowserWindowTitle() {
    // DM Notification
    if (this.firstDmNotification) {
      this.setNotificationICO(true);
      document.title = `(!) ${this.firstDmNotification.sender.username} - Nertivia BETA`;
      return;
    }
    // Server Notification
    const notification: any = this.firstServerNotification;
    if (!notification?.server_id) {
      document.title = "Nertivia BETA";
      this.setNotificationICO(false);
      return;
    }
    this.setNotificationICO(true);

    const server = ServersModule.servers[notification.server_id];
    document.title = `(!) ${server.name}#${notification.name} - Nertivia BETA`;
  }
  setNotificationICO(set: boolean) {
    const icoSelector = document.querySelector("link[rel='icon']");
    if (set) {
      icoSelector?.setAttribute("href", "/img/icons/favicon-notification.ico");
      return;
    }
    icoSelector?.setAttribute("href", "/img/icons/favicon-32x32.png");
  }

  get showMessageArea() {
    if (!this.currentChannelID) return false;
    if (this.currentTab === "servers" || this.currentTab === "dms") return true;
    return false;
  }

  get currentChannelID() {
    return this.$route.params.channel_id;
  }

  get leftDrawerOpened() {
    return DrawersModule.leftDrawer;
  }
  get currentServerID() {
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get me() {
    return MeModule.user;
  }
  get isConnected() {
    return MeModule.connected;
  }
  get users() {
    return UsersModule.users;
  }
  get windowWidth() {
    return WindowProperties.resizeWidth;
  }
  get isMobileWidth() {
    return this.windowWidth <= 950;
  }

  get firstServerNotification() {
    return LastSeenServerChannelsModule.allServerNotifications.sort(
      (a, b) => (b.lastMessaged || 0) - (a.lastMessaged || 0)
    )?.[0];
  }
  get firstDmNotification() {
    return NotificationsModule.allDMNotifications?.reverse()?.[0];
  }
  get focused() {
    return WindowProperties.isFocused;
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-60px);
}
.app {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (max-width: 950px) {
  .app {
    flex-direction: column;
  }
  .nav-bar {
    z-index: 111111;
    background: var(--background-color);
    order: 2;
  }
  .drawers {
    order: 1;
  }
}
</style>
