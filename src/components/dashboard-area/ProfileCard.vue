<template>
  <div class="card">
    <div class="title">
      Profile
    </div>
    <div class="content">
      <avatar-image
        class="avatar"
        :imageId="me.avatar"
        :seedId="me.uniqueID"
        size="80px"
        :animateGif="false"
      />
      <div class="info">
        <span class="username">{{ me.username }}</span
        ><span class="tag">:{{ me.tag }}</span>
      </div>
      <div class="custom-status">
        {{ me.custom_status }}
      </div>
      <div class="online-status">
        <div class="dot" />
        <div class="name">Online</div>
      </div>
      <div class="material-icons settings-icon" @click="settingsClicked">
        settings
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { MeModule } from "@/store/modules/me";

@Component({ components: { AvatarImage } })
export default class ProfileCard extends Vue {
  settingsClicked() {
    this.$router.push("/app/settings/account");
  }
  get me() {
    return MeModule.user;
  }
}
</script>
<style lang="scss" scoped>
.content .title {
  margin: 10px;
  margin-left: 5px;
  font-size: 20px;
}
.card {
  position: relative;
  margin: 10px;
  margin-top: 10px;
  background: #303844;
  padding: 5px;
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 250px;
  border-radius: 8px;
  overflow: auto;
  .item-title {
    opacity: 0.8;
    margin-left: 5px;
    user-select: none;
  }
}
.content {
  display: flex;
  flex-direction: column;
}
.avatar {
  align-self: center;
  margin-top: 25px;
}
.info {
  margin-top: 15px;
  align-self: center;
  .tag {
    opacity: 0.8;
  }
}
.custom-status {
  align-self: center;
  margin-top: 5px;
  padding: 3px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
}
.online-status {
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.3);
  align-self: center;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 10px;
  height: 20px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  .dot {
    margin-right: 5px;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: rgb(145, 255, 145);
  }
  .name {
    margin-top: 1px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
.settings-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
  }
}
</style>
