<script lang="tsx">
import { ExtraServerMembers } from "@/interfaces/ServerMember";
import ServerRole from "@/interfaces/ServerRole";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import WindowProperties from "@/utils/windowProperties";
import Vue from "vue";
import ServerMemberTemplate from "./ServerMemberTemplate.vue";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const virtualList = require("vue-virtual-scroll-list");

export default Vue.extend({
  components: { ServerMemberTemplate, virtualList },
  data() {
    return {
      tempServerId: ""
    };
  },
  render() {
    const renderMembers = (members: any) => {
      return members.map((member: any) => {
        return (
          <server-member-template
            key={member.id}
            serverMember={member}
            style={{ height: "40px" }}
          />
        );
      });
    };
    return (
      <div class="right-drawer">
        <div class="header">
          {this.$t("right-drawer.server-members", [this.serverMembers.length])}
        </div>
        <div class="members" key={this.tempServerId}>
          <virtual-list
            size={260}
            remain={this.remain}
            variable={true}
            key={this.remain}
          >
            {this.roleWithMembers.map(role => {
              return [
                <div class="tab" style={{ height: "25px" }}>
                  {role.role.name} ({role.members.length})
                </div>,
                renderMembers(role.members)
              ];
            })}
            {this.onlineMembersWithNoRoles.length > 0 && (
              <div class="tab" style={{ height: "25px" }}>
                {this.defaultRole?.name ?? this.$t("presence.online")} (
                {this.onlineMembersWithNoRoles.length})
              </div>
            )}
            {renderMembers(this.onlineMembersWithNoRoles)}
            {this.offlineMembers.length > 0 && (
              <div class="tab" style={{ height: "25px" }}>
                {this.$t("presence.offline")} ({this.offlineMembers.length})
              </div>
            )}
            {renderMembers(this.offlineMembers)}
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
      setTimeout(() => {
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
      return this.$route.params.server_id;
    },
    remain(): number {
      return Math.round(WindowProperties.resizeHeight / 40);
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
