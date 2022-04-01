<template>
  <div class="container manage-roles">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("server-settings.tab-names.manage-roles") }}
      </div>
      <div class="notice">
        {{ $t("server-settings.manage-roles.manage-your-roles") }}
      </div>
      <SelectedRolesPage
        v-if="selectedRoleID"
        :roleID="selectedRoleID"
        @close="selectedRoleID = null"
      />
      <div class="box" v-if="!selectedRoleID">
        <CustomButton
          class="button"
          :name="$t('server-settings.manage-roles.create-role')"
          icon="add"
          @click="createRole"
        />

        <div class="role-list">
          <Draggable
            :animation="200"
            filter=".disabled"
            ghost-class="ghost"
            :delay="$isMobile ? 400 : 0"
            v-model="allowedToMoveRoles"
            item-key="id"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <RoleTemplate :role="element" @click="roleClicked(element)" />
            </template>
          </Draggable>
          <!-- Default role always stays at the bottom. -->
          <RoleTemplate
            :role="defaultRole"
            @click="selectedRoleID = defaultRole.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Draggable from "vuedraggable";
import { ServersModule } from "@/store/modules/servers";
import CustomButton from "@/components/CustomButton.vue";
import RoleTemplate from "./RoleTemplate.vue";
import SelectedRolesPage from "./SelectedRolesPage.vue";
import { createServerRole, updateRolePosition } from "@/services/rolesService";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import ServerRole from "@/interfaces/ServerRole";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { MeModule } from "@/store/modules/me";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageRoles",
  components: {
    CustomButton,
    RoleTemplate,
    Draggable,
    SelectedRolesPage,
  },
  data() {
    return {
      selectedRoleID: null as string | null,
      createRequestSent: false,
    };
  },
  computed: {
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    myHighestRoleOrder(): any {
      return (
        ServerMembersModule.highestRoleOrder(
          this.serverID,
          MeModule?.user?.id || ""
        ) || 0
      );
    },
    allowedToMoveRoles: {
      get(): any {
        return this.roles.map((r) => {
          return {
            ...r,
            canModify:
              this.isServerCreator || this.myHighestRoleOrder < r.order,
          };
        });
      },
      set(roles: any) {
        const orderedRoles = roles.map((r, index) => {
          return { ...r, order: index, canModify: undefined };
        });
        // to obj
        const obj: any = {};
        for (let i = 0; i < orderedRoles.length; i++) {
          const item = orderedRoles[i];
          obj[item.id] = item;
        }
        this.defaultRole && (obj[this.defaultRole?.id] = this.defaultRole);
        ServerRolesModule.AddServerRoles({
          roles: obj,
          serverID: this.serverID,
        });
      },
    },
    isServerCreator(): any {
      return ServersModule.isServerOwner(
        this.serverID,
        MeModule?.user?.id || ""
      );
    },
    roles(): ServerRole[] {
      return ServerRolesModule.sortedServerRolesArr(this.serverID).filter(
        (r) => !r.default
      );
    },
    defaultRole(): any {
      return ServerRolesModule.defaultServerRole(this.serverID);
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  methods: {
    onDragEnd(event: any) {
      const newIndex = event.newIndex;
      const role = this.roles[newIndex];
      const sendObj = { roleID: role.id, order: newIndex };
      updateRolePosition(this.serverID, sendObj);
    },
    roleClicked(role: any) {
      if (!role.canModify) return;
      this.selectedRoleID = role.id;
    },
    createRole() {
      if (this.createRequestSent) return;
      this.createRequestSent = true;
      createServerRole(this.serverID)
        .then((res) => {
          ServerRolesModule.AddServerRole(res);
          this.selectedRoleID = res.id;
        })
        .finally(() => {
          this.createRequestSent = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0;
}
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
.role-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 10px;
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
.button {
  align-self: flex-start;
  border: none;
  color: white;
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.03);
}
</style>
