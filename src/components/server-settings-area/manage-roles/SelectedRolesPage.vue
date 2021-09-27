<template>
  <div class="container selected-role-page">
    <div class="notice warn" v-if="role && role.bot">
      {{ $t("server-settings.manage-roles.notice-bot") }}
    </div>
    <div class="notice warn" v-if="role && role.default">
      {{ $t("server-settings.manage-roles.notice-default") }}
    </div>
    <div class="name-color">
      <div
        class="color"
        :title="$t('server-settings.manage-roles.pick-role-color')"
        @click="showPicker"
        :style="{ backgroundColor: color || 'white' }"
      />
      <CustomInput
        :error="error"
        class="input"
        :title="$t('server-settings.manage-roles.role-name')"
        v-model="name"
      />
      <div class="hidden picker-button" ref="pickerButton">
        <div class="pickr"></div>
      </div>
    </div>
    <div class="title">{{ $t("server-settings.manage-roles.settings") }}</div>
    <CheckBox
      v-model="hideRole"
      class="check-box"
      :name="$t('server-settings.manage-roles.hide-role')"
      description="Display members with this role along with all the default members"
    />
    <div class="title">{{ $t("server-settings.permissions.permissions") }}</div>
    <div class="perm-list">
      <CheckBox
        v-for="perm in permissionsList"
        :key="perm.value"
        :colored="true"
        :modelValue="perm.enabled"
        class="check-box"
        :class="{ disabled: !perm.canModify }"
        :name="perm.name"
        :description="perm.info"
        @change="checkBoxChange($event, perm)"
      />
    </div>
    <CustomButton
      class="button"
      :filled="true"
      :name="!requestSent ? $t('save-changes') : $t('saving')"
      icon="save"
      v-if="showSaveButton"
      @click="update"
    />
    <CustomButton
      v-if="showDeleteButton"
      class="button delete-button"
      :filled="true"
      :name="
        !deleteConfirm
          ? $t('server-settings.manage-roles.delete-role')
          : deleteRequestSent
          ? $t('server-settings.manage-roles.deleting-role')
          : $t('are-you-sure')
      "
      :alert="true"
      icon="delete"
      @click="deleteRole"
    />
    <CustomButton
      class="button back-button"
      :name="$t('back')"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import "@simonwep/pickr/dist/themes/classic.min.css";
import Pickr from "@simonwep/pickr";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import CheckBox from "@/components/CheckBox.vue";
import { MeModule } from "@/store/modules/me";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import ServerRole from "@/interfaces/ServerRole";
import { bitwiseRemove, bitwiseContains, bitwiseAdd } from "@/utils/bitwise";
import { permissions } from "@/constants/rolePermissions";
import { deleteServerRole, updateServerRole } from "@/services/rolesService";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServersModule } from "@/store/modules/servers";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageRolesPage",
  components: { CustomInput, CustomButton, CheckBox },
  props: {
    roleID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pickr: null as Pickr | null,
      error: null as string | null,
      requestSent: false,
      deleteConfirm: false,
      deleteRequestSent: false,
      name: "",
      permissions: 0,
      hideRole: false,
      color: null as string | null | undefined,
    };
  },
  computed: {
    role(): ServerRole | undefined {
      return ServerRolesModule.serverRoles[this.serverID]?.[this.roleID];
    },
    permissionsList(): any {
      return Object.values(permissions).map((p) => {
        const canModify =
          this.isServerCreator ||
          !!ServerMembersModule.memberHasPermission(
            MeModule.user.id || "",
            this.serverID,
            p.value,
            true
          );

        return {
          ...p,
          enabled: !!bitwiseContains(this.permissions || 0, p.value),
          canModify,
        };
      });
    },
    showSaveButton(): any {
      return (
        this.change.channelName ||
        this.change.perms ||
        this.change.hideRole ||
        this.change.color
      );
    },
    isServerCreator(): any {
      return ServersModule.isServerOwner(
        this.serverID,
        MeModule?.user?.id || ""
      );
    },
    change(): any {
      const channelName = this.name !== this.role?.name;
      const perms = this.permissions !== this.role?.permissions || 0;
      const hideRole = this.hideRole !== (this.role?.hideRole || false);
      const color = this.color !== this.role?.color;
      return { channelName, perms, hideRole, color };
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
    connected(): any {
      return MeModule.connected;
    },
    showDeleteButton(): any {
      return !this.role?.default && this.role?.deletable;
    },
  },
  watch: {
    connected: {
      handler: "isConnected",
    },
    role: {
      handler: "roleChange",
    },
  },
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
          input: true,
          cancel: true,
        },
      },
    });
    this.pickr.on("hide", this.colorChanged);
  },
  beforeUnmount() {
    this.pickr?.off("hide", this.colorChanged);
    this.pickr?.destroyAndRemove();
  },
  methods: {
    reset() {
      this.name = this.role?.name || "";
      this.permissions = this.role?.permissions || 0;
      this.hideRole = this.role?.hideRole || false;
      this.color = this.role?.color;
    },
    showPicker(event: any) {
      const rect = event.target.getBoundingClientRect();
      const top = rect.top - 47;
      (this.$refs.pickerButton as HTMLElement).style.top = top + "px";
      this.pickr?.setColor(this.color || "white");
      this.pickr?.show();
    },
    colorChanged(event: any) {
      const hex = event.getColor().toHEXA().toString();
      this.color = hex;
    },
    checkBoxChange(checked: boolean, perm: any) {
      if (!perm.canModify) return;
      if (checked) {
        this.permissions = bitwiseAdd(this.permissions, perm.value);
      } else {
        this.permissions = bitwiseRemove(this.permissions, perm.value);
      }
    },
    update() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      updateServerRole(this.serverID, this.roleID, {
        name: this.name,
        permissions: this.permissions,
        hideRole: this.hideRole,
        color: this.color as string,
      })
        .then((role) => {
          ServerRolesModule.UpdateServerRole(role);
          this.reset();
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const { message, errors } = await err.response.json();
          this.error = message || errors[0].msg;
        })
        .finally(() => {
          this.requestSent = false;
        });
    },
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
            role_id: this.roleID,
          });
          this.$emit("close");
        })
        .finally(() => {
          this.deleteRequestSent = false;
          this.deleteConfirm = false;
        });
    },
    isConnected(val: boolean) {
      if (val) {
        this.reset();
      }
    },
    roleChange(role: ServerRole) {
      if (!role) {
        this.$emit("close");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.check-box {
  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}
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
.notice.warn {
  border: solid 1px var(--warn-color);
  padding: 5px;
  border-radius: 4px;
  max-width: 600px;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
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
