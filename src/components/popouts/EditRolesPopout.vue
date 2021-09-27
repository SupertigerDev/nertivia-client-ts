<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="profile-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            :imageId="user.avatar"
            :seedId="user.id"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">Edit Roles</div>
        </div>
        <div class="inner-content">
          <div
            class="role"
            v-for="role in serverRoles"
            :class="{ selected: role.hasRole, disabled: !role.canModify }"
            :key="role.id"
            @click="roleClicked(role)"
          >
            <div
              class="role-color"
              :style="{
                borderColor: role.color,
                background: role.hasRole ? role.color || 'white' : '',
              }"
            />
            <div class="role-name">{{ role.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { UsersModule } from "@/store/modules/users";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { addRole, removeRole } from "@/services/userService";
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { AvatarImage },
  props: {
    data: {
      type: Object as PropType<{ id: string; serverID: string }>,
      required: true,
    },
  },
  computed: {
    serverRoles(): any {
      const serverID = this.data.serverID;
      const id = this.data.id;
      return ServerRolesModule.sortedServerRolesArr(this.data.serverID)
        .filter((r) => !r.default && r.deletable)
        .map((role) => {
          const hasRole = ServerMembersModule.memberHasRole(
            serverID,
            id,
            role.id
          );
          const canModify =
            this.isServerCreator || this.myHighestRoleOrder < role.order;
          return {
            ...role,
            canModify,
            hasRole,
          };
        });
    },
    myHighestRoleOrder(): any {
      return (
        ServerMembersModule.highestRoleOrder(
          this.data.serverID,
          MeModule?.user?.id || ""
        ) || 0
      );
    },
    isServerCreator(): any {
      return ServersModule.isServerOwner(
        this.data.serverID,
        MeModule?.user?.id || ""
      );
    },
    user(): any {
      return UsersModule.users[this.data.id] || {};
    },
  },
  methods: {
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        PopoutsModule.ClosePopout("edit-role");
      }
    },
    roleClicked(role: { hasRole: string; id: string; canModify: boolean }) {
      if (!role.canModify) return;
      const func = role.hasRole ? removeRole : addRole;
      func(this.data.serverID, this.data.id, role.id);
    },
  },
});
</script>
<style lang="scss" scoped>
.profile-popout {
  background: var(--popout-color);
  border-radius: 4px;
  width: 300px;
  overflow: hidden;
  height: 350px;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 10px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.role {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .role-name {
    opacity: 0.6;
  }
  &:hover {
    .role-name {
      opacity: 1;
    }
  }
  &.selected {
    .role-name {
      opacity: 1;
    }
  }
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: initial;
    }
    .role-name {
      opacity: 0.6;
    }
  }
}
.role-color {
  margin-right: 5px;
  background: transparent;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: solid 3px;
}
</style>
