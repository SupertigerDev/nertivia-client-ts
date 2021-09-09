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
        <router-view v-if="loadPage" />
      </div>
    </Drawers>
  </div>
</template>

<script lang="ts">
import socketIOModule from "@/store/modules/socketIO/socketIOModule";
import { ServersModule } from "@/store/modules/servers";
import { UsersModule } from "@/store/modules/users";
import { MeModule } from "@/store/modules/me";

import ConnectionStatus from "@/components/popouts/ConnectionStatusPopout.vue";
import BrowserTitleHandler from "@/components/renderless/BrowserIcoHandler";
import ElectronBadgeHandler from "@/components/renderless/ElectronBadgeHandler";
import ElectronActivityHandler from "@/components/renderless/ElectronActivityHandler";
import UpdateChecker from "@/components/renderless/UpdateChecker";

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

import { loadAllCacheToState, loadCache } from "@/utils/localCache";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { useWindowProperties } from "@/utils/windowProperties";
import { FriendsModule } from "@/store/modules/friends";

import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import { AppUpdateModule } from "@/store/modules/appUpdate";
import { applyTheme } from "@/utils/CSSTheme";
import Vue from "vue";
import { TabsModule } from "@/store/modules/tabs";
import { defineComponent } from "vue";
import store from "@/store";
export default defineComponent({
  name: "MainApp",
  components: {
    Drawers,
    LeftDrawer,
    RightDrawer,
    NavBar,
    ConnectionStatus,
    BrowserTitleHandler,
    ElectronBadgeHandler,
    ElectronActivityHandler,
    UpdateChecker
  },
  data() {
    return {
      showConnectionStatusPopout: true,
      currentActiveProgram: null as any | null,
      programActivityTimeout: null as any,
      loadPage: false
    };
  },
  computed: {
    currentChannelID(): any {
      return this.$route.params.channel_id;
    },
    currentServerID(): any {
      return this.$route.params.server_id;
    },
    currentTab(): any {
      return this.$route.path.split("/")[2];
    },
    isConnected(): any {
      return MeModule.connected;
    }
  },
  watch: {
    currentChannelID: {
      handler: "saveLastSelected"
    },
    currentServerID: {
      handler: "saveLastSelected"
    },
    currentTab: {
      handler: "saveLastSelected"
    },
    isConnected: {
      handler: "showConnectionPopout"
    }
  },
  mounted() {
    // set store and connect socket.
    store.registerModule("socketIO", socketIOModule);
    // $fix below
    // this.$socket.client.connect();
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel("sw-messages");
      // hack to fix disconnects using service workers;
      channel.addEventListener("message", event => {
        // $fix below
        // const client = this.$socket.client;
        if (event.data !== "ping") return;
        if (useWindowProperties().isFocused) return;
        // $fix below
        // if (!client.connected) return;
        // client.emit("p");
      });
    }
  },
  created() {
    localStorage.removeItem("lastSelectedDMChannelID");
    localStorage.removeItem("lastSelectedServerID");
    this.saveLastSelected();
    this.loadCache();
    this.applyCSSTheme();
  },
  beforeDestroy() {
    store.unregisterModule("socketIO");
  },
  methods: {
    applyCSSTheme() {
      const id = localStorage["themeID"];
      if (!id) return;
      applyTheme(id);
    },
    async loadCache() {
      const tabs = await loadCache("tabs");
      if (tabs) {
        TabsModule.initTabs(tabs);
      }
      this.loadPage = true;
      await loadAllCacheToState([
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
          storage: "users",
          state: UsersModule.InitUsers
        },
        {
          storage: "channels",
          state: ChannelsModule.InitChannels
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
    },
    saveLastSelected() {
      AppUpdateModule.check();
      if (this.$route.name !== "message-area") return;
      if (this.currentTab === "servers") {
        LastSelectedServersModule.UpdateLastSelected({
          serverID: this.currentServerID,
          channelID: this.currentChannelID
        });
        localStorage.setItem("lastSelectedServerID", this.currentServerID);
      } else if (this.currentTab === "dms" && this.currentChannelID) {
        localStorage.setItem("lastSelectedDMChannelID", this.currentChannelID);
      }
    },
    showConnectionPopout() {
      AppUpdateModule.check({ force: true });
      if (!this.isConnected) {
        this.showConnectionStatusPopout = true;
      }
    }
  }
});
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
