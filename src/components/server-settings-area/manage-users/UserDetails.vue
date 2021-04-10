<template>
  <div class="container">
    <div class="detail">
      <span class="title">User:</span>
      <span>{{ member.username }}:</span>
      <span class="tag">{{ member.tag }}</span>
    </div>
    <div class="detail">
      <span class="title">Permissions:</span>
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
    <CustomButton class="back-button" name="Back" @click="$emit('close')" />
  </div>
</template>
<script lang="ts">
import { permissions } from "@/constants/rolePermissions";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import CustomButton from "@/components/CustomButton.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { ServersModule } from "@/store/modules/servers";
import { bitwiseAdd, bitwiseContains } from "@/utils/bitwise";

@Component({ components: { CustomButton } })
export default class UserDetails extends Vue {
  @Prop() private serverMember!: any;

  get permFriendlyNamesArr() {
    const permArr = Object.values(permissions);
    // if its the creator of the server, always allow everything
    const creatorUniqueID = this.server?.creator?.id;
    const isServerCreator = creatorUniqueID === this.serverMember.id;
    return permArr.map(p => {
      return {
        ...p,
        hasPerm:
          bitwiseContains(this.totalPermissions, p.value) || isServerCreator
      };
    });
  }

  get totalPermissions() {
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
  }
  get server() {
    return ServersModule.servers[this.serverMember.server_id];
  }
  get member() {
    return this.serverMember.member;
  }
}
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
