<template>
  <div class="container manage-channels">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        Manage Roles
      </div>
      <div class="notice">
        Manage your roles.
      </div>
      <SelectedRolesPage
        v-if="selectedRoleID"
        :roleID="selectedRoleID"
        @close="selectedRoleID = null"
      />
      <div class="box" v-if="!selectedRoleID">
        <CustomButton
          class="button"
          name="Create New Role"
          icon="add"
          @click="createRole"
        />

        <div class="channel-list">
          <RoleTemplate
            v-for="role in roles"
            :key="role.id"
            :role="role"
            @click.native="selectedRoleID = role.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import { ServersModule } from "@/store/modules/servers";
import CustomButton from "@/components/CustomButton.vue";
import RoleTemplate from "./RoleTemplate.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import SelectedRolesPage from "./SelectedRolesPage.vue";
import { ServerRolesModule } from "@/store/modules/serverRoles";
@Component({
  components: {
    CustomInput,
    CustomButton,
    RoleTemplate,
    ContextMenu,
    SelectedRolesPage
  }
})
export default class ManageChannels extends Vue {
  selectedRoleID: string | null = null;
  createRequestSent = false;

  createRole() {
    if (this.createRequestSent) return;
    this.createRequestSent = true;
  }

  get server() {
    return ServersModule.servers[this.serverID];
  }
  get roles() {
    return ServerRolesModule.serverRoles[this.serverID];
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
  margin: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}

.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.button {
  align-self: flex-start;
  border: none;
  color: white;
  background: rgba(255, 255, 255, 0.03);
}
</style>
