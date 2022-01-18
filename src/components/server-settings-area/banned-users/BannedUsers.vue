<template>
  <div class="container">
    <LoadingScreen v-if="bans === null" />
    <div class="inner-container" v-else>
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("server-settings.tab-names.banned-users") }}
      </div>
      <div class="notice">
        {{ $t("server-settings.banned-users.notice") }}
      </div>
      <div class="box">
        <div class="users-list">
          <template v-for="(user, i) in bans" :key="user?.id || i">
            <UserTemplate v-if="user" :user="user" @deleted="userUnbanned(i)" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ServersModule } from "@/store/modules/servers";

import LoadingScreen from "@/components/LoadingScreen.vue";
import UserTemplate from "./UserTemplate.vue";
import User from "@/interfaces/User";
import { getBannedUsers } from "@/services/serverService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerSettingsArea",
  components: { LoadingScreen, UserTemplate },
  data() {
    return {
      bans: null as User[] | null,
    };
  },
  computed: {
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    getBannedUsers(this.serverID).then((data) => {
      this.bans = data.reverse().map((d) => d.user);
    });
  },
  methods: {
    userUnbanned(index: number) {
      if (!this.bans) return;
      this.bans.splice(index, 1);
    },
  },
});
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
