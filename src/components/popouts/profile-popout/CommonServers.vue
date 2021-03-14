<template>
  <div class="common-servers">
    <div class="title">Common Servers</div>
    <div class="list">
      <div
        class="server"
        v-for="item in servers"
        :key="item.server_id"
        :title="item.name"
        @click="serverClicked(item)"
      >
        <AvatarImage
          :seedId="item.server_id"
          :imageId="item.avatar"
          size="40px"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Server from "@/interfaces/Server";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: { AvatarImage }
})
export default class CommonServers extends Vue {
  @Prop() private servers!: Server[];
  serverClicked(server: Server) {
    this.$router.push(
      `/app/servers/${server.server_id}/${server.default_channel_id}`
    );
    PopoutsModule.ClosePopout("profile");
  }
}
</script>
<style scoped lang="scss">
.list {
  display: flex;
  overflow: auto;
}
.server {
  flex-shrink: 0;
  margin: 3px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
</style>
