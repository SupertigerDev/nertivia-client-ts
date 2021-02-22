<template>
  <div class="container">
    <CustomInput class="input" title="Role Name" v-model="name" />
    <div class="title">Permissions</div>
    <CheckBox
      v-for="perm in permissionsList"
      :key="perm.value"
      :checked="true"
      :name="perm.name"
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
import { containsPerm, permissions } from "@/constants/rolePermissions";
@Component({
  components: { CustomInput, CustomButton, CheckBox }
})
export default class ManageRolesPage extends Vue {
  @Prop() private roleID!: string;
  name = "";
  permissions = 0;

  reset() {
    this.name = this.role?.name || "";
    this.permissions = this.role?.permissions || 0;
  }
  mounted() {
    this.reset();
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
        enabled: containsPerm(this.permissions || 0, p.value)
      };
    });
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
.container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-items: flex-start;
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
