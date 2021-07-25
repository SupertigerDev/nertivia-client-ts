<template>
  <div class="app">
    <BrowserTitleHandler />
    <ElectronBadgeHandler v-if="$isElectron" />
    <ElectronActivityHandler v-if="$isElectron" />
    <UpdateChecker />
    <NavBar class="nav-bar" />
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
import BrowserTitleHandler from "@/components/renderless/BrowserIcoHandler";
import ElectronBadgeHandler from "@/components/renderless/ElectronBadgeHandler";
import ElectronActivityHandler from "@/components/renderless/ElectronActivityHandler";
import UpdateChecker from "@/components/renderless/UpdateChecker";
import Header from "@/components/Header.vue";

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
import WindowProperties from "@/utils/windowProperties";
import { FriendsModule } from "@/store/modules/friends";

import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import { AppUpdateModule } from "@/store/modules/appUpdate";
import { applyTheme } from "@/utils/CSSTheme";

@Component({
  components: {
    Drawers,
    LeftDrawer,
    RightDrawer,
    NavBar,
    Header,
    ConnectionStatus,
    BrowserTitleHandler,
    ElectronBadgeHandler,
    ElectronActivityHandler,
    UpdateChecker,
  },
})
export default class MainApp extends Vue {
  showConnectionStatusPopout = true;
  // used for electron
  currentActiveProgram: any | null = null;
  programActivityTimeout: any = null;
  mounted() {
    // set store and connect socket.
    this.$store.registerModule("socketIO", socketIOModule);
    this.$socket.client.connect();
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel("sw-messages");
      // hack to fix disconnects using service workers;
      channel.addEventListener("message", (event) => {
        const client = this.$socket.client;
        if (event.data !== "ping") return;
        if (WindowProperties.isFocused) return;
        if (!client.connected) return;
        client.emit("p");
      });
    }
  }
  beforeMount() {
    localStorage.removeItem("lastSelectedDMChannelID");
    localStorage.removeItem("lastSelectedServerID");
    this.saveLastSelected();
    this.loadCache();
    this.applyCSSTheme();
  }
  applyCSSTheme() {
    const id = localStorage["themeID"];
    if (!id) return;
    applyTheme(id);
  }
  async loadCache() {
    await loadAllCacheToState([
      {
        storage: "me",
        state: MeModule.SetUser,
      },
      {
        storage: "serverPositions",
        state: ServersModule.SetServerPositions,
      },
      {
        storage: "servers",
        state: ServersModule.InitServers,
      },
      {
        storage: "users",
        state: UsersModule.InitUsers,
      },
      {
        storage: "channels",
        state: ChannelsModule.InitChannels,
      },

      {
        storage: "friends",
        state: FriendsModule.InitFriends,
      },
      {
        storage: "serverRoles",
        state: ServerRolesModule.InitServerRoles,
      },
      {
        storage: "serverMembers",
        state: ServerMembersModule.InitServerMembers,
      },
    ]);
  }

  beforeDestroy() {
    this.$store.unregisterModule("socketIO");
  }
  // save last selected channels
  @Watch("currentChannelID")
  @Watch("currentServerID")
  @Watch("currentTab")
  saveLastSelected() {
    AppUpdateModule.check();
    if (this.$route.name !== "message-area") return;
    if (this.currentTab === "servers") {
      LastSelectedServersModule.UpdateLastSelected({
        serverID: this.currentServerID,
        channelID: this.currentChannelID,
      });
      localStorage.setItem("lastSelectedServerID", this.currentServerID);
    } else if (this.currentTab === "dms" && this.currentChannelID) {
      localStorage.setItem("lastSelectedDMChannelID", this.currentChannelID);
    }
  }
  @Watch("isConnected")
  showConnectionPopout() {
    AppUpdateModule.check({ force: true });
    if (!this.isConnected) {
      this.showConnectionStatusPopout = true;
    }
  }

  get currentChannelID() {
    return this.$route.params.channel_id;
  }
  get currentServerID() {
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get isConnected() {
    return MeModule.connected;
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
