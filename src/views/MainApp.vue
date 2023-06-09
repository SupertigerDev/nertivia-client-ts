<template>
  <div class="app">
    <BrowserTitleHandler />
    <ElectronBadgeHandler v-if="$isElectron" />
    <ElectronActivityHandler v-if="$isElectron" />
    <UpdateChecker />
    <NavBar class="nav-bar" />
    <Drawers class="drawers">
      <template v-slot:drawer-left>
        <LeftDrawer />
      </template>
      <template v-slot:drawer-right>
        <RightDrawer v-if="currentTab === 'servers' && currentChannelID" />
      </template>
      <template v-slot:content>
        <div class="content">
          <transition name="fade" appear>
            <ConnectionStatus
              v-if="showConnectionStatusPopout"
              @close="showConnectionStatusPopout = false"
            />
          </transition>
          <router-view v-if="loadPage" />
          <MobileInCallFooter v-if="isMobileWidth && isInCall" />
        </div>
      </template>
    </Drawers>
  </div>
</template>

<script lang="ts">
import { ServersModule } from "@/store/modules/servers";
import { UsersModule } from "@/store/modules/users";
import { MeModule } from "@/store/modules/me";

import ConnectionStatus from "@/components/popouts/ConnectionStatusPopout.vue";
import BrowserTitleHandler from "@/components/renderless/BrowserIcoHandler";
import ElectronBadgeHandler from "@/components/renderless/ElectronBadgeHandler";
import ElectronActivityHandler from "@/components/renderless/ElectronActivityHandler";
import UpdateChecker from "@/components/renderless/UpdateChecker";

import { loadAllCacheToState, loadCache } from "@/utils/localCache";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { useWindowProperties } from "@/utils/windowProperties";
import { FriendsModule } from "@/store/modules/friends";

import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import { AppUpdateModule } from "@/store/modules/appUpdate";
import { applyTheme } from "@/utils/CSSTheme";
import { defineAsyncComponent } from "vue";
import { TabsModule } from "@/store/modules/tabs";
import { defineComponent } from "vue";
import store from "@/store";
import { PopoutsModule } from "@/store/modules/popouts";
import { voiceChannelModule } from "@/store/modules/voiceChannels";

const Drawers = defineAsyncComponent(
  () => import("@/components/drawers/Drawers.vue")
);
const NavBar = defineAsyncComponent(() => import("@/components/NavBar.vue"));

const LeftDrawer = defineAsyncComponent(
  () => import("@/components/drawers/LeftDrawer.vue")
);
const RightDrawer = defineAsyncComponent(
  () => import("@/components/drawers/RightDrawer.vue")
);
const MobileInCallFooter = defineAsyncComponent(
  () => import("@/components/MobileInCallFooter.vue")
);

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
    UpdateChecker,
    MobileInCallFooter
  },
  data() {
    return {
      showConnectionStatusPopout: true,
      currentActiveProgram: null as any | null,
      programActivityTimeout: null as any,
      loadPage: false,
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
    },
    isMobileWidth() {
      return useWindowProperties().isMobileWidth;
    },
    isInCall() {
      return voiceChannelModule.joinedChannelId;
    }
  },
  watch: {
    currentChannelID: {
      handler: "saveLastSelected",
    },
    currentServerID: {
      handler: "saveLastSelected",
    },
    currentTab: {
      handler: "saveLastSelected",
    },
    isConnected: {
      handler: "showConnectionPopout",
    },
  },
  mounted() {
      PopoutsModule.ShowPopout({
        id: "d-popout",
        component: "DiscontinuedPopout",
      });



    //const result = confirm("Nertivia is in a read-only state due to the database reaching full capacity.\nPlease try out Nerimity instead.\n\nOK: Visit https://nerimity.com\nCancel: Do nothing.")
    
    //if (result) {
     // window?.open("https://nerimity.com", '_blank')?.focus?.();
    //}

    this.$socket.connect();
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel("sw-messages");
      // hack to fix disconnects using service workers;
      channel.addEventListener("message", (event) => {
        if (event.data !== "ping") return;
        if (useWindowProperties().isFocused) return;
        if (!this.$socket.connected) return;
        this.$socket.emit("p");
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
  beforeUnmount() {
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
    },
    saveLastSelected() {
      const routeName = this.$route.name as string;
      AppUpdateModule.check();
      if (!routeName?.endsWith("message-area")) return;
      if (this.currentTab === "servers") {
        LastSelectedServersModule.UpdateLastSelected({
          serverID: this.currentServerID,
          channelId: this.currentChannelID,
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
    },
  },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
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
