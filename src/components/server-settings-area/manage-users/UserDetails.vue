<template>
  <div class="container">
    <div class="detail">
      <span class="title">{{ $t("generic.user") }}:</span>
      <span>{{ member.username }}:</span>
      <span class="tag">{{ member.tag }}</span>
    </div>
    <div class="detail">
      <span class="title"
        >{{ $t("server-settings.permissions.permissions") }}:</span
      >
      <div class="perms-list">
        <div
          class="list"
          v-for="perm of permFriendlyNamesArr"
          :key="perm.value"
          :title="perm.info"
        >
          <div class="dot" :class="{ hasPerm: perm.hasPerm }" />
          {{ perm.name }}
        </div>
      </div>
    </div>
    <CustomButton
      class="back-button"
      :name="$t('back')"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import { permissions } from "@/constants/rolePermissions";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import CustomButton from "@/components/CustomButton.vue";
import { ServersModule } from "@/store/modules/servers";
import { bitwiseAdd, bitwiseContains } from "@/utils/bitwise";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserDetails",
  components: { CustomButton },
  props: {
    serverMember: {
      type: Object as any,
      required: true,
    },
  },
  computed: {
    permFriendlyNamesArr(): any {
      const permArr = Object.values(permissions);
      // if its the creator of the server, always allow everything
      const creatorID = this.server?.creator?.id;
      const isServerCreator = creatorID === this.serverMember.id;
      return permArr.map((p) => {
        return {
          ...p,
          hasPerm:
            bitwiseContains(this.totalPermissions, p.value) || isServerCreator,
        };
      });
    },
    totalPermissions(): any {
      let totalPerms = 0;
      if (this.serverMember?.roles.length) {
        for (let i = 0; i < this.serverMember.roles.length; i++) {
          const perm = this.serverMember.roles[i].permissions;
          totalPerms = bitwiseAdd(totalPerms, perm);
        }
      }
      // add default role
      const defaultRole = ServerRolesModule.defaultServerRole(
        this.serverMember.server_id
      );
      totalPerms = bitwiseAdd(totalPerms, defaultRole?.permissions || 0);
      return totalPerms;
    },
    server(): any {
      return ServersModule.servers[this.serverMember.server_id];
    },
    member(): any {
      return this.serverMember.member;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 10px;
}
.detail {
  .title {
    opacity: 0.7;
    margin-right: 5px;
  }
  .tag {
    opacity: 0.9;
  }
  margin: 5px;
}
.perms-list {
  margin-top: 5px;
  .list {
    display: flex;
    align-items: center;
    align-content: center;
    margin-top: 5px;
  }
  .dot {
    height: 7px;
    width: 7px;
    background: var(--alert-color);
    margin-right: 5px;
    border-radius: 50%;
    &.hasPerm {
      background: var(--success-color);
    }
  }
}
.back-button {
  align-self: flex-start;
  margin-top: auto;
}
</style>
