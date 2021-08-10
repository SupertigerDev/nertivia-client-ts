<template>
  <div class="server-list">
    <Draggable
      :animation="200"
      v-model="servers"
      :delay="$isMobile ? 400 : 0"
      ghost-class="ghost"
      @end="onDragEnd"
    >
      <ServerTemplate
        v-for="server in servers"
        :key="server.server_id"
        :server="server"
      />
    </Draggable>
  </div>
</template>

<script lang="ts">
import { ServersModule } from "@/store/modules/servers";
import ServerTemplate from "./ServerTemplate.vue";
import Draggable from "vuedraggable";
import Server from "@/interfaces/Server";
import { changeServerPosition } from "@/services/serverService";
import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import Vue from "vue";
export default Vue.extend({
  name: "Servers",
  components: { ServerTemplate, Draggable },
  computed: {
    servers: {
      get(): Server[] {
        return ServersModule.sortedServers;
      },
      set(servers: Server[]) {
        const serverIDArr = servers.map(s => s.server_id);
        ServersModule.SetServerPositions(serverIDArr);
      }
    },
    currentServerID(): any {
      return this.$route.params.server_id;
    }
  },
  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      if (this.servers.length <= 1) return;
      if (!event.ctrlKey) return;
      if (!event.altKey) return;
      const arrowUp = event.key === "ArrowUp";
      const arrowDown = event.key === "ArrowDown";
      if (arrowUp || arrowDown) {
        arrowUp && this.gotoPreviousServer();
        arrowDown && this.gotoNextServer();
        event.preventDefault();
      }
    },
    gotoNextServer() {
      const index = this.servers.findIndex(
        s => s.server_id === this.currentServerID
      );
      let gotoIndex = index;
      if (index === -1) return;
      if (index === this.servers.length - 1) {
        gotoIndex = 0;
      } else {
        gotoIndex = index + 1;
      }
      const server = this.servers[gotoIndex];
      const serverChannelID = LastSelectedServersModule.lastServerChannelID(
        server.server_id || ""
      );
      this.$router.push(
        `/app/servers/${server.server_id}/${serverChannelID ||
          server.default_channel_id}`
      );
    },
    gotoPreviousServer() {
      const index = this.servers.findIndex(
        s => s.server_id === this.currentServerID
      );
      let gotoIndex = index;
      if (index === -1) return;
      if (index === 0) {
        gotoIndex = this.servers.length - 1;
      } else {
        gotoIndex = index - 1;
      }
      const server = this.servers[gotoIndex];
      const serverChannelID = LastSelectedServersModule.lastServerChannelID(
        server.server_id || ""
      );
      this.$router.push(
        `/app/servers/${server.server_id}/${serverChannelID ||
          server.default_channel_id}`
      );
    },
    onDragEnd() {
      const serverIDArr = this.servers.map(s => s.server_id);
      changeServerPosition(serverIDArr);
    }
  }
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0;
}
.server-list {
  overflow: auto;
  width: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.server-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.server-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
