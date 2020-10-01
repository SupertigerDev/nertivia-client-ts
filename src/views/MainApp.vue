<template>
  <div class="app" :class="{ leftDrawerOpened: leftDrawerOpened }">
    <NavBar class="nav-bar" v-if="!isMobileWidth || leftDrawerOpened" />
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
        <MessageArea v-if="showMessageArea" />
        <SettingsArea v-else-if="currentTab === 'settings'" />
        <Header :title="`Hello, ${me.username}!`" v-else />
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

import ConnectionStatus from "@/components/ConnectionStatusPopout.vue";
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

const MessageArea = () =>
  import(
    /* webpackChunkName: "MessageArea" */ "@/components/chat-area/MessageArea.vue"
  );
const SettingsArea = () =>
  import(
    /* webpackChunkName: "SettingsArea" */ "@/components/settings-area/SettingsArea.vue"
  );

import { loadAllCacheToState } from "@/utils/localCache";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { DrawersModule } from "@/store/modules/drawers";
import WindowProperties from "@/utils/windowProperties";
import { FriendsModule } from "@/store/modules/friends";

@Component({
  components: {
    Drawers,
    LeftDrawer,
    MessageArea,
    RightDrawer,
    NavBar,
    Header,
    SettingsArea,
    ConnectionStatus
  }
})
export default class MainApp extends Vue {
  showConnectionStatusPopout = true;
  mounted() {
    // set store and connect socket.
    this.$store.registerModule("socketIO", socketIOModule);
    this.$socket.client.connect();
    // set primary color
    const primaryColor = localStorage.getItem("primaryColor");
    if (primaryColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        primaryColor
      );
    }
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

  @Watch("currentChannelID")
  @Watch("currentServerID")
  @Watch("currentTab")
  saveLastSelected() {
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
    return this.windowWidth <= 650;
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
@media (max-width: 650px) {
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
