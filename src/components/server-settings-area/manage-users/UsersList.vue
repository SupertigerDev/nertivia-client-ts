<script lang="tsx">
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";

import UserTemplate from "./UserTemplate.vue";

import VirtualList from "@supertiger/vue-3-virtual-scroll-list";

import ServerMember from "@/interfaces/ServerMember";
import ServerRole from "@/interfaces/ServerRole";

import { defineComponent } from "vue";
import { UsersModule } from "@/store/modules/users";
export default defineComponent({
  components: { UserTemplate, VirtualList },
  props: {
    search: String,
  },
  render() {
    const renderTab = (name: string, count: number) => {
      return count ? (
        <div class="tab" style={{ height: "25px" }}>
          {name} ({count})
        </div>
      ) : (
        <template />
      );
    };

    const renderMember = (member: any) => {
      return (
        <user-template
          serverMember={member}
          id={`user-${member.id}`}
          style={{ height: "40px" }}
        />
      );
    };

    return (
      <div class="right-drawer" onClick={this.onClick}>
        <div class="members" key={this.serverId + this.search}>
          <virtual-list
            ref="virtualList"
            size={260}
            remain={40}
            variable={true}
          >
            {this.list?.map((item) =>
              item.title
                ? renderTab(item.title, item.count)
                : renderMember(this.serverMembers[item])
            )}
          </virtual-list>
        </div>
      </div>
    );
  },
  methods: {
    onClick(event: any) {
      const element = event.target.closest(".server-member");
      if (!element) return;
      const id = element.id.split("-")[1];
      this.$emit("userClick", id);
    },
  },
  computed: {
    serverMembersArr(): ServerMember[] {
      return Object.values(
        ServerMembersModule.serverMembers[this.serverId || ""] || {}
      ).sort((a, b) => {
        const usernameA = UsersModule.users[a.id].username.toLowerCase();
        const usernameB = UsersModule.users[b.id].username.toLowerCase();
        if (usernameA < usernameB) return -1;
        if (usernameA > usernameB) return 1;
        return 0;
      });
    },
    serverMembers(): { [key: string]: ServerMember } {
      return ServerMembersModule.serverMembers[this.serverId || ""];
    },
    list(): any[] {
      const unConsumedMembers = this.serverMembersArr
        .map((sm) => sm.id)
        .filter((m) => {
          if (!this.search) return true;
          const username = UsersModule.users[m].username.toLowerCase();
          return username.toLowerCase().includes(this.search.toLowerCase());
        });
      const roleMembers = this.serverRoles
        .filter((r) => !r.hideRole)
        .map((role) => {
          const members = [...unConsumedMembers].filter((id) => {
            if (!unConsumedMembers.includes(id)) return false;
            const member = this.serverMembers[id];
            if (!member.roleIdArr.includes(role.id)) return false;
            unConsumedMembers.splice(unConsumedMembers.indexOf(id), 1);
            return true;
          });
          if (!members.length) return [];
          return [
            { title: role.name, id: role.id, size: 25, count: members.length },
            ...members,
          ];
        })
        .flat();

      const allMembers = Object.values(unConsumedMembers);

      const defaultRoleTitle = {
        title: this.defaultRole?.name || "Online",
        id: this.defaultRole?.id || "loading",
        count: allMembers.length,
      };

      return [...roleMembers, defaultRoleTitle, ...allMembers];
    },
    defaultRole(): ServerRole | undefined {
      return ServerRolesModule.defaultServerRole(this.serverId);
    },
    serverRoles(): ServerRole[] {
      return ServerRolesModule.sortedServerRolesArr(this.serverId);
    },

    serverId(): string {
      return this.$route.params.server_id as string;
    },
  },
});
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
