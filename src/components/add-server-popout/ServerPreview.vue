<template>
  <div class="preview-server">
    <div class="banner">
      <img v-if="bannerURL" class="banner-img" :src="bannerURL" />
    </div>
    <AvatarImage
      class="avatar"
      :animateGif="true"
      :seedId="server.server_id"
      :imageId="server.avatar"
      size="80px"
    />
    <div class="name">{{ server.name }}</div>
    <div class="buttons">
      <CustomButton
        class="button"
        :warn="true"
        name="Back"
        @click="$emit('back')"
      />
      <CustomButton v-if="!isJoined" class="button" name="Join Server" />
      <CustomButton
        v-if="isJoined"
        class="button"
        :valid="true"
        name="Visit Server"
        @click="visitServer"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import CustomButton from "@/components/CustomButton.vue";

import config from "@/config";
import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";
@Component({ components: { AvatarImage, CustomButton } })
export default class PreviewServer extends Vue {
  @Prop() private server!: {
    avatar: string;
    server_id: string;
    banner: string;
    name: string;
    default_channel_id: string;
  };
  visitServer() {
    PopoutsModule.ClosePopout("add-server");
    this.$router.push(
      `/app/servers/${this.server.server_id}/${this.server.default_channel_id}`
    );
  }
  get bannerURL() {
    return config.nertiviaCDN + this.server.banner;
  }
  get isJoined() {
    return ServersModule.servers[this.server.server_id];
  }
}
</script>

<style lang="scss" scoped>
.preview-server {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 10px;
  display: flex;
  flex-direction: column;
}
.banner {
  background-position: 50%;
  background-size: cover;
  height: 150px;
  overflow: hidden;
  width: 100%;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.banner-img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.banner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  bottom: 0;
  transition: 0.2s;
  background: rgba(0, 0, 0, 0.3);
}
.avatar {
  z-index: 99999;
  margin-top: -50px;
  margin-left: 10px;
}
.name {
  margin-left: 10px;
  margin-top: 5px;
}

.buttons {
  margin-top: auto;
  margin-left: auto;
}
</style>
