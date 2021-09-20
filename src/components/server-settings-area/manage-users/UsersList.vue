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
    search: String
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

    const unConsumedUserIds: string[] = this.rawMembers.map(m => m.id);
    const renderDefaults = () => {
      return [
        renderTab(this.defaultRole?.name || "Online", unConsumedUserIds.length),
        unConsumedUserIds.map((id, index) => {
          unConsumedUserIds.splice(index, 1);
          return renderMember(
            ServerMembersModule.serverMembers[this.server_id][id]
          );
        })
      ];
    };
    return (
      <div class="right-drawer" onClick={this.onClick}>
        <div class="members" key={this.server_id + this.search}>
          <virtual-list
            ref="virtualList"
            size={260}
            remain={40}
            variable={true}
          >
            {...this.serverRoles
              .filter(r => !r.hideRole)
              .map(r => {
                const members = this.rawMembers.filter(m => {
                  if (!unConsumedUserIds.includes(m.id)) return false;
                  if (!m.roleIdArr.includes(r.id)) return false;
                  const index = unConsumedUserIds.indexOf(m.id);
                  unConsumedUserIds.splice(index, 1);
                  return true;
                });
                return [
                  renderTab(r.name, members.length),

                  members.map(member => {
                    return renderMember(member);
                  })
                ];
              })}
            {...renderDefaults()}
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
    }
  },
  computed: {
    rawMembers(): ServerMember[] {
      return Object.values(
        ServerMembersModule.serverMembers[this.server_id] || {}
      )
        .filter(m => {
          if (!this.search) return true;
          const username = UsersModule.users[m.id].username.toLowerCase();
          return username.toLowerCase().includes(this.search.toLowerCase());
        })
        .sort((a, b) => {
          const usernameA = UsersModule.users[a.id].username.toLowerCase();
          const usernameB = UsersModule.users[b.id].username.toLowerCase();
          if (usernameA < usernameB) return -1;
          if (usernameA > usernameB) return 1;
          return 0;
        });
    },
    defaultRole(): ServerRole | undefined {
      return ServerRolesModule.defaultServerRole(this.server_id);
    },
    serverRoles(): ServerRole[] {
      return ServerRolesModule.sortedServerRolesArr(this.server_id);
    },
    server_id(): string {
      return this.$route.params.server_id as string;
    }
  }
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
