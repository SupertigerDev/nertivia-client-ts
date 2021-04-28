<template>
  <div class="item">
    <div class="details">
      <!-- TODO: i18n -->
      <div class="same-line">
        <div class="name">{{ item.file.name }}</div>
        <div class="size">{{ sizeLabel }}</div>
      </div>
      <div class="channel">{{ channelName }}</div>
      <div class="progress" v-if="item.uploading && item.progress !== 100">
        {{ item.progress }}% complete...
      </div>
      <div class="progress" v-else-if="item.uploading && item.progress == 100">
        Processing...
      </div>
      <div class="state" v-if="!item.uploading">
        Pending...
      </div>
    </div>
    <div class="seperator">
      <div class="bar" :style="{ width: item.progress + '%' }" />
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import fileSize from "filesize";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class UploadQueueItem extends Vue {
  @Prop() private item!: {
    file: File;
    uploading: boolean;
    progress: number;
    channelID: string;
  };
  get sizeLabel() {
    return fileSize(this.item.file.size);
  }
  get channelName() {
    if (this.channel.name) {
      const serverName =
        ServersModule.servers[this.channel.server_id || ""].name;
      return serverName + "#" + this.channel.name;
    }
    const username =
      "@" + this.DMChannel?.recipients?.[0].username || "Unknown";
    return username;
  }
  get DMChannel() {
    return ChannelsModule.getDMChannel(this.item.channelID);
  }
  get channel() {
    return ChannelsModule.channels[this.item.channelID];
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  .size {
    opacity: 0.6;
    margin: auto;
    margin-right: 0;
  }
  .state {
    opacity: 0.6;
  }
  .material-icons {
    font-size: 30px;
    width: 40px;
    display: flex;
    align-self: center;
    justify-content: center;
    margin-right: 5px;
  }
  .details {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .same-line {
    display: flex;
    width: 100%;
    align-items: center;
    align-content: center;
  }
  .progress {
    opacity: 0.6;
  }
}
.seperator {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  .bar {
    height: 100%;
    width: 0;
    background: var(--primary-color);
  }
}
.channel {
  opacity: 0.4;
  transition: 0.2s;
  align-self: flex-start;
  // user-select: none;
  // cursor: pointer;
  // &:hover {
  //   opacity: 1;
  //   text-decoration: underline;
  // }
}
</style>
