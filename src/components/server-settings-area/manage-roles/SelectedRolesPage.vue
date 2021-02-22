<template>
  <div class="container selected-role-page">
    <CustomInput class="input" title="Role Name" v-model="name" />
    <div class="title">Permissions</div>
    <CheckBox
      v-for="perm in permissionsList"
      :key="perm.value"
      :colored="true"
      :checked="perm.enabled"
      :name="perm.name"
      :description="perm.info"
      @change="checkBoxChange($event, perm.value)"
    />
    <CustomButton
      class="button"
      :filled="true"
      :name="!requestSent ? 'Save Changes' : 'Saving...'"
      icon="save"
      v-if="showSaveButton"
      @click="update"
    />
    <CustomButton
      class="button delete-button"
      :filled="true"
      :name="
        !deleteConfirm
          ? 'Delete Role'
          : deleteRequestSent
          ? 'Deleting Role...'
          : 'Are you sure?'
      "
      :warn="true"
      icon="delete"
      @click="deleteRole"
    />
    <CustomButton
      class="button back-button"
      name="Back"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import CheckBox from "@/components/CheckBox.vue";
import { MeModule } from "@/store/modules/me";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import ServerRole from "@/interfaces/ServerRole";
import {
  addPerm,
  containsPerm,
  permissions,
  removePerm
} from "@/constants/rolePermissions";
@Component({
  components: { CustomInput, CustomButton, CheckBox }
})
export default class ManageRolesPage extends Vue {
  @Prop() private roleID!: string;
  requestSent = false;
  deleteConfirm = false;
  deleteRequestSent = false;
  name = "";
  permissions = 0;

  reset() {
    this.name = this.role?.name || "";
    this.permissions = this.role?.permissions || 0;
  }
  mounted() {
    this.reset();
  }
  checkBoxChange(checked: boolean, perm: number) {
    if (checked) {
      this.permissions = addPerm(this.permissions, perm);
    } else {
      this.permissions = removePerm(this.permissions, perm);
    }
  }
  update() {
    if (this.requestSent) return;
    this.requestSent = true;
  }
  deleteRole() {
    if (this.deleteRequestSent) return;
    if (!this.deleteConfirm) {
      this.deleteConfirm = true;
      return;
    }
    this.deleteRequestSent = true;
  }
  @Watch("connected")
  isConnected(val: boolean) {
    if (val) {
      this.reset();
    }
  }
  @Watch("role")
  roleChange(role: ServerRole) {
    if (!role) {
      this.$emit("close");
    }
  }

  get role(): ServerRole | undefined {
    return ServerRolesModule.serverRoles[this.serverID].find(
      r => r.id === this.roleID
    );
  }
  get permissionsList() {
    return Object.values(permissions).map(p => {
      return {
        ...p,
        enabled: !!containsPerm(this.permissions || 0, p.value)
      };
    });
  }

  get showSaveButton() {
    return this.change.channelName || this.change.perms;
  }
  get change() {
    const channelName = this.name !== this.role?.name;
    const perms = this.permissions !== this.role?.permissions || 0;
    return { channelName, perms };
  }

  get serverID() {
    return this.$route.params.server_id;
  }
  get connected() {
    return MeModule.connected;
  }
}
</script>

<style lang="scss" scoped>
.container.selected-role-page {
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: flex-start;
  overflow: auto;
}
.input {
  margin-left: -2px;
}
.button {
  margin-top: 10px;
  margin-left: 0;
}
.delete-button {
  margin-top: 50px;
}
.back-button {
  margin: auto;
  margin-left: 0px;
  margin-bottom: 0;
}
.title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}
</style>
