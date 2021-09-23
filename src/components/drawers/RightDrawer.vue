<script lang="tsx">
import ServerMember, { ExtraServerMembers } from "@/interfaces/ServerMember";
import ServerRole from "@/interfaces/ServerRole";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { useWindowProperties } from "@/utils/windowProperties";

import ServerMemberTemplate from "./ServerMemberTemplate.vue";

import VirtualList from "@supertiger/vue-3-virtual-scroll-list";

import { defineComponent } from "vue";
import { PresencesModule } from "@/store/modules/presences";
import { UsersModule } from "@/store/modules/users";
export default defineComponent({
  components: { ServerMemberTemplate, VirtualList },
  data() {
    return {
      tempServerId: ""
    };
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
        <server-member-template
          key={member.id}
          serverMember={member}
          style={{ height: "40px" }}
        />
      );
    };
    const unConsumedUserIds: string[] = this.rawMembers.map(m => m.id);

    const renderRoles = () => {
      return this.serverRoles
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
            renderTab(r.name, members.length),

            members.map(member => {
              return renderMember(member);
            })
          ];
        });
    };

    const renderOnline = () => {
      const onlineMembers = unConsumedUserIds.filter(id => {
        return PresencesModule.getPresence(id);
      });
      return [
        renderTab(this.defaultRole?.name || "Online", onlineMembers.length),
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
            {...renderRoles()}
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
      }, 100);
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
      ).sort((a, b) => {
        const usernameA = UsersModule.users[a.id].username.toLowerCase();
        const usernameB = UsersModule.users[b.id].username.toLowerCase();
        if (usernameA < usernameB) return -1;
        if (usernameA > usernameB) return 1;
        return 0;
      });
    },
    defaultRole(): ServerRole | undefined {
      return ServerRolesModule.defaultServerRole(this.tempServerId);
    },
    serverRoles(): ServerRole[] {
      return ServerRolesModule.sortedServerRolesArr(this.tempServerId);
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
