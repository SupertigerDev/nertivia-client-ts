<template>
  <div class="container">
    <div class="box">
      <CustomInput
        :title="$t('server-settings.manage-users.search-user')"
        v-model="searchValue"
        v-show="!selectedServerMember"
      />
      <UsersList
        :search="searchValue"
        @userClick="userClicked"
        v-show="!selectedServerMember"
      />
      <UserDetails
        class="user-details"
        :serverMember="selectedServerMember"
        v-if="selectedServerMember"
        @close="selectedServerMember = null"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import UsersList from "./UsersList.vue";
import UserDetails from "./UserDetails.vue";
import { ServerMembersModule } from "@/store/modules/serverMembers";

@Component({ components: { CustomInput, UsersList, UserDetails } })
export default class ServerSettingsArea extends Vue {
  searchValue = "";
  selectedServerMember: any = null;
  userClicked(id: string) {
    this.selectedServerMember = ServerMembersModule.serverMember(
      this.serverID,
      id
    );
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
  margin: 10px;
  position: relative;
  flex: 1;
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
.user-details {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
