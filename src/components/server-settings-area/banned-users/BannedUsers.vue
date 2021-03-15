<template>
  <div class="container">
    <LoadingScreen v-if="bans === null" />
    <div class="inner-container" v-else>
      <div class="description">
        <div class="material-icons">info</div>
        Banned Users
      </div>
      <div class="notice">
        Unban members from here
      </div>
      <div class="box">
        <div class="users-list">
          <UserTemplate
            v-for="(user, i) in bans"
            :key="user.uniqueID"
            :user="user"
            @deleted="userUnbanned(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ServersModule } from "@/store/modules/servers";

import LoadingScreen from "@/components/LoadingScreen.vue";
import UserTemplate from "./UserTemplate.vue";
import User from "@/interfaces/User";
import { getBannedUsers } from "@/services/serverService";

@Component({
  components: { LoadingScreen, UserTemplate }
})
export default class ServerSettingsArea extends Vue {
  bans: User[] | null = null;
  mounted() {
    getBannedUsers(this.serverID).then(data => {
      this.bans = data.reverse().map(d => d.user);
    });
  }
  userUnbanned(index: number) {
    if (!this.bans) return;
    this.$delete(this.bans, index);
  }
  get server() {
    return ServersModule.servers[this.serverID];
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 10px;
  margin-top: 10px;
  .material-icons {
    margin-right: 5px;
  }
}

.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 40px;
}
.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}

.users-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
