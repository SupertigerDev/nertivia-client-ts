<template>
  <div class="server-list">
    <Draggable
      :animation="200"
      v-model="Servers"
      :delay="$isMobile ? 400 : 0"
      ghost-class="ghost"
      @end="onDragEnd"
    >
      <ServerTemplate
        v-model="Servers"
        v-for="server in Servers"
        :key="server.server_id"
        :server="server"
      />
    </Draggable>
  </div>
</template>

<script lang="ts">
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue } from "vue-property-decorator";
import ServerTemplate from "./ServerTemplate.vue";
import Draggable from "vuedraggable";
import Server from "@/interfaces/Server";
import { changeServerPosition } from "@/services/serverService";

@Component({ components: { ServerTemplate, Draggable } })
export default class MainApp extends Vue {
  onDragEnd() {
    const serverIDArr = this.Servers.map(s => s.server_id);
    changeServerPosition(serverIDArr);
  }
  get Servers() {
    return ServersModule.sortedServers;
  }
  set Servers(servers: Server[]) {
    const serverIDArr = servers.map(s => s.server_id);
    ServersModule.SetServerPositions(serverIDArr);
  }
}
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
