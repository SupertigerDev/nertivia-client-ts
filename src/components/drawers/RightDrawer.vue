<script lang="tsx">
import ServerMember, { ExtraServerMembers } from "@/interfaces/ServerMember";
import ServerRole from "@/interfaces/ServerRole";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { useWindowProperties } from "@/utils/windowProperties";
import Vue from "vue";
import ServerMemberTemplate from "./ServerMemberTemplate.vue";

import VirtualList from "@supertiger/vue-3-virtual-scroll-list";

import { defineComponent } from "vue";
import { PresencesModule } from "@/store/modules/presences";
export default defineComponent({
  components: { ServerMemberTemplate, VirtualList },
  data() {
    return {
      tempServerId: ""
    };
  },
  render() {
    const renderTab = (name: string, count: number) => {
      return (
        <div class="tab" style={{ height: "25px" }}>
          {name} ({count})
        </div>
      );
    };
    const renderMember = (member: any) => {
      return (
        <server-member-template
          key={member.id}
          serverMember={member}
          style={{ height: "40px" }}
        />
      );
    };
    const unConsumedUserIds: string[] = this.rawMembers.map(m => m.id);

    const renderOnline = () => {
      const onlineMembers = unConsumedUserIds.filter(id => {
        return PresencesModule.getPresence(id);
      });
      return [
        renderTab("Online", onlineMembers.length),
        onlineMembers.map((id, index) => {
          unConsumedUserIds.splice(index, 1);
          return renderMember(
            ServerMembersModule.serverMembers[this.tempServerId][id]
          );
        })
      ];
    };
    const renderOffline = () => {
      const offlineMembers = unConsumedUserIds;
      return [
        renderTab("Offline", offlineMembers.length),
        offlineMembers.map((id, index) => {
          unConsumedUserIds.splice(index, 1);
          return renderMember(
            ServerMembersModule.serverMembers[this.tempServerId][id]
          );
        })
      ];
    };
    return (
      <div class="right-drawer">
        <div class="header">
          {this.$t("right-drawer.server-members", [this.rawMembers.length])}
        </div>
        <div class="members" key={this.tempServerId}>
          <virtual-list
            size={260}
            remain={this.remain}
            variable={true}
            key={this.remain}
          >
            {...this.serverRoles
              .filter(r => !r.hideRole)
              .map(r => {
                const members = this.rawMembers.filter(m => {
                  if (!unConsumedUserIds.includes(m.id)) return false;
                  if (!m.roleIdArr.includes(r.id)) return false;
                  if (!PresencesModule.getPresence(m.id)) return false;
                  const index = unConsumedUserIds.indexOf(m.id);
                  unConsumedUserIds.splice(index, 1);
                  return true;
                });
                return [
                  members.length ? (
                    renderTab(r.name, members.length)
                  ) : (
                    <template />
                  ),

                  members.map(member => {
                    return renderMember(member);
                  })
                ];
              })}
            {...renderOnline()}
            {...renderOffline()}
          </virtual-list>
        </div>
      </div>
    );
  },
  mounted() {
    this.updateTempServerId();
  },
  methods: {
    updateTempServerId() {
      window.setTimeout(() => {
        this.tempServerId = this.serverId;
      }, 0);
    }
  },
  watch: {
    serverId() {
      this.updateTempServerId();
    }
  },
  computed: {
    rawMembers(): ServerMember[] {
      return Object.values(
        ServerMembersModule.serverMembers[this.tempServerId || ""] || {}
      );
    },
    serverMembers(): ExtraServerMembers[] {
      // sort by alphabet
      return ServerMembersModule.filteredServerMembers(this.tempServerId).sort(
        (a, b) => {
          const usernameA = a.member.username.toLowerCase();
          const usernameB = b.member.username.toLowerCase();
          if (usernameA < usernameB) return -1;
          if (usernameA > usernameB) return 1;
          return 0;
        }
      );
    },
    roleWithMembers(): { role: ServerRole; members: ExtraServerMembers[] }[] {
      const roleWithMembers: any[] = [];
      const consumedMemberIds: string[] = [];
      if (!this.serverRoles) return [];
      for (let i = 0; i < this.serverRoles.length; i++) {
        const role = this.serverRoles[i];
        const members = this.onlineMembers.filter(member => {
          if (consumedMemberIds.includes(member.id)) return false;
          const findRole = member.roles.find(r => r && !r.hideRole);
          if (!findRole) return false;
          if (role.id !== findRole.id) return false;
          consumedMemberIds.push(member.id);
          return true;
        });
        if (!members.length) continue;
        roleWithMembers.push({ role, members });
      }
      return roleWithMembers;
    },
    onlineMembers(): ExtraServerMembers[] {
      return this.serverMembers.filter(sm => sm.presence);
    },
    defaultRole(): ServerRole | undefined {
      return ServerRolesModule.defaultServerRole(this.tempServerId);
    },
    onlineMembersWithNoRoles(): ExtraServerMembers[] {
      return this.onlineMembers.filter(member => {
        if (!member.roles.length) return true;
        const roleExists = member.roles.find(r => r && !r.hideRole);
        return !roleExists;
      });
    },
    serverRoles(): ServerRole[] {
      return ServerRolesModule.sortedServerRolesArr(this.tempServerId);
    },
    offlineMembers(): ExtraServerMembers[] {
      return this.serverMembers.filter(sm => !sm.presence);
    },
    serverId(): string {
      return this.$route.params.server_id as string;
    },
    remain(): number {
      return Math.round(useWindowProperties().resizeHeight / 40);
    }
  }
});
</script>
<style scoped>
.right-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;

  flex-shrink: 0;
  overflow: auto;
}
.members {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
.header {
  display: flex;
  align-items: center;
  background-color: var(--side-header-bg-color);
  justify-content: center;
  height: 40px;
  flex-shrink: 0;
}
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 6px;
  height: 25px;
  flex-shrink: 0;
}
</style>
