<template>
  <div class="container selected-role-page">
    <div class="name-color">
      <div
        class="color"
        title="Pick Role Color"
        @click="showPicker"
        :style="{ backgroundColor: color || 'white' }"
      />
      <CustomInput
        :error="error"
        class="input"
        title="Role Name"
        v-model="name"
      />
      <div class="hidden picker-button" ref="pickerButton">
        <div class="pickr"></div>
      </div>
    </div>
    <div class="title">Settings</div>
    <CheckBox
      v-model="hideRole"
      class="check-box"
      name="Hide Role"
      description="Display members with this role along with all the default members"
    />
    <div class="title">Permissions</div>
    <div class="perm-list">
      <CheckBox
        v-for="perm in permissionsList"
        :key="perm.value"
        :colored="true"
        :checked="perm.enabled"
        class="check-box"
        :name="perm.name"
        :description="perm.info"
        @change="checkBoxChange($event, perm.value)"
      />
    </div>
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
import "@simonwep/pickr/dist/themes/classic.min.css";
import Pickr from "@simonwep/pickr";
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
import { deleteServerRole, updateServerRole } from "@/services/rolesService";
@Component({
  components: { CustomInput, CustomButton, CheckBox }
})
export default class ManageRolesPage extends Vue {
  @Prop() private roleID!: string;
  pickr: Pickr | null = null;

  error: string | null = null;
  requestSent = false;
  deleteConfirm = false;
  deleteRequestSent = false;
  name = "";
  permissions = 0;
  hideRole = false;
  color: string | null | undefined = null;

  reset() {
    this.name = this.role?.name || "";
    this.permissions = this.role?.permissions || 0;
    this.hideRole = this.role?.hideRole || false;
    this.color = this.role?.color;
  }
  mounted() {
    this.reset();
    this.pickr = Pickr.create({
      el: ".pickr",
      theme: "classic",
      components: {
        preview: true,
        opacity: true,
        hue: true,
        palette: true,
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          cancel: true
        }
      }
    });
    this.pickr.on("hide", this.colorChanged);
  }
  showPicker(event: any) {
    const rect = event.target.getBoundingClientRect();
    const top = rect.top - 47;
    (this.$refs.pickerButton as HTMLElement).style.top = top + "px";
    this.pickr?.setColor(this.color || "white");
    this.pickr?.show();
  }
  colorChanged(event: any) {
    const hex = event
      .getColor()
      .toHEXA()
      .toString();
    this.color = hex;
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
    updateServerRole(this.serverID, this.roleID, {
      name: this.name,
      permissions: this.permissions,
      hideRole: this.hideRole,
      color: this.color!
    })
      .then(role => {
        ServerRolesModule.UpdateServerRole(role);
        this.reset();
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const { message, errors } = await err.response.json();
        this.error = message || errors[0].msg;
      })
      .finally(() => {
        this.requestSent = false;
      });
  }
  deleteRole() {
    if (this.deleteRequestSent) return;
    if (!this.deleteConfirm) {
      this.deleteConfirm = true;
      return;
    }
    this.deleteRequestSent = true;
    deleteServerRole(this.serverID, this.roleID)
      .then(() => {
        ServerRolesModule.DeleteServerRole({
          server_id: this.serverID,
          role_id: this.roleID
        });
        this.$emit("close");
      })
      .finally(() => {
        this.deleteRequestSent = false;
        this.deleteConfirm = false;
      });
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
    return ServerRolesModule.serverRoles[this.serverID]?.[this.roleID];
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
    return (
      this.change.channelName ||
      this.change.perms ||
      this.change.hideRole ||
      this.change.color
    );
  }
  get change() {
    const channelName = this.name !== this.role?.name;
    const perms = this.permissions !== this.role?.permissions || 0;
    const hideRole = this.hideRole !== (this.role?.hideRole || false);
    const color = this.color !== this.role?.color;
    return { channelName, perms, hideRole, color };
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
  margin-top: 5px;
}
.perm-list {
  display: flex;
  flex-direction: column;
}
.name-color {
  display: flex;
  align-items: center;
  align-content: center;
  .color {
    margin-bottom: 15px;
    border-radius: 4px;
    margin-right: 5px;
    cursor: pointer;
    height: 45px;
    width: 45px;
  }
}
.hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
<style lang="scss">
.pcr-app {
  z-index: 99999999999 !important;
  background: #1a1a1de8;
  border-radius: 4px;
}
.pcr-palette::before {
  background: white !important;
}
.pcr-color-preview::before {
  background: white !important;
}
</style>
