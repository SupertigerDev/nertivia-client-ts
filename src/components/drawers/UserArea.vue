<template>
  <div class="user-area">
    <AvatarImage
      class="avatar"
      size="40px"
      :image-id="me.avatar"
      :seed-id="me.uniqueID"
    />
    <div class="user-details">
      <div class="user-and-tag">
        <span class="username">{{ me.username }}</span>
        <span class="tag">:{{ me.tag }}</span>
      </div>
      <div class="status-details" v-if="connected">
        <div class="status-color"></div>
        <div class="custom-status">Click to add status.</div>
      </div>
      <div v-else>
        {{ connectionMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { Component, Vue } from "vue-property-decorator";

const AvatarImage = () =>
  import(/* webpackChunkName: "AvatarImage" */ "@/components/AvatarImage.vue");

@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
  get connected() {
    return MeModule.connected;
  }
  get connectionMessage() {
    return MeModule.connectionMessage;
  }
  get me() {
    return MeModule.user;
  }
}
</script>
<style lang="scss" scoped>
.user-area {
  display: flex;
  align-items: center;
  align-content: center;
  height: 73px;
  background-image: linear-gradient(to right, #1fa2ff 0%, #1fa2ff 100%);
  color: white;
  margin: 4px;
  border-radius: 4px;
}
.avatar {
  margin-left: 10px;
}
.user-details {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  .tag {
    opacity: 0.7;
  }
}
.status-details {
  display: flex;
  align-items: center;
}
.status-color {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: rgb(139, 255, 145);
  margin-right: 5px;
}
.custom-status {
  font-size: 14px;
  opacity: 0.8;
}
</style>
