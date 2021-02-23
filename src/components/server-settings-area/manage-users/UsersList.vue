<script lang="tsx">
import { DrawersModule } from "@/store/modules/drawers";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import UserTemplate from "./UserTemplate.vue";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const virtualList = require("vue-virtual-scroll-list");

@Component({ components: { UserTemplate, virtualList } })
export default class RightDrawer extends Vue {
  @Prop() private search!: string;

  render() {
    const renderMembers = (members: any) => {
      return members.map((member: any) => {
        return (
          <user-template
            onUserClick={() => this.$emit("userClick", member)}
            serverMember={member}
            style={{ height: "40px" }}
          />
        );
      });
    };
    return (
      <div class="right-drawer">
        <div class="members" key={this.server_id}>
          <virtual-list
            ref="virtualList"
            size={260}
            remain={40}
            variable={true}
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
                {this.defaultRole?.name ? this.defaultRole?.name : "Offline"} (
                {this.onlineMembersWithNoRoles.length})
              </div>
            )}
            {renderMembers(this.onlineMembersWithNoRoles)}
            {this.offlineMembers.length > 0 && (
              <div class="tab" style={{ height: "25px" }}>
                Offline ({this.offlineMembers.length})
              </div>
            )}
            {renderMembers(this.offlineMembers)}
          </virtual-list>
        </div>
      </div>
    );
  }

  @Watch("search")
  onInput() {
    (this.$refs.virtualList as any).forceRender();
  }
  get serverMembers() {
    // sort by alphabet and filter search
    return ServerMembersModule.filteredServerMembers(this.server_id)
      .filter(m =>
        !this.search
          ? true
          : m.member.username.toLowerCase().includes(this.search.toLowerCase())
      )
      .sort((a, b) => {
        const usernameA = a.member.username.toLowerCase();
        const usernameB = b.member.username.toLowerCase();
        if (usernameA < usernameB) return -1;
        if (usernameA > usernameB) return 1;
        return 0;
      });
  }
  get roleWithMembers() {
    const roleWithMembers = [];
    const consumedMemberIds: string[] = [];
    if (!this.serverRoles) return [];
    for (let i = 0; i < this.serverRoles.length; i++) {
      const role = this.serverRoles[i];
      const members = this.onlineMembers.filter(member => {
        if (consumedMemberIds.includes(member.uniqueID)) return false;
        const findRole = member.roles.find(r => r && !r.hideRole);
        if (!findRole) return false;
        if (role.id !== findRole.id) return false;
        consumedMemberIds.push(member.uniqueID);
        return true;
      });
      if (!members.length) continue;
      roleWithMembers.push({ role, members });
    }
    return roleWithMembers;
  }
  get onlineMembers() {
    return this.serverMembers.filter(sm => sm.presence);
  }
  get defaultRole() {
    return ServerRolesModule.defaultServerRole(this.server_id);
  }
  get onlineMembersWithNoRoles() {
    return this.onlineMembers.filter(member => {
      if (!member.roles.length) return true;
      const roleExists = member.roles.find(r => r && !r.hideRole);
      return !roleExists;
    });
  }
  get serverRoles() {
    return ServerRolesModule.sortedServerRolesArr(this.server_id);
  }
  get offlineMembers() {
    return this.serverMembers.filter(sm => !sm.presence);
  }
  get server_id() {
    return this.$route.params.server_id;
  }
  beforeDestroy() {
    DrawersModule.SetRightDrawer(false);
  }
}
</script>
<style scoped>
.right-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
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
