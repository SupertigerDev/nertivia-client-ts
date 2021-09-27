<script lang="tsx">
import ServerMember, { ExtraServerMembers } from "@/interfaces/ServerMember";
import ServerRole from "@/interfaces/ServerRole";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { useWindowProperties } from "@/utils/windowProperties";

import ServerMemberTemplate from "./ServerMemberTemplate.vue";

import VirtualList from "@supertiger/vue-3-virtual-scroll-list";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { defineComponent } from "vue";
import { PresencesModule } from "@/store/modules/presences";
import { UsersModule } from "@/store/modules/users";
export default defineComponent({
  components: { ServerMemberTemplate, VirtualList, RecycleScroller },
  data() {
    return {
      tempServerId: "",
    };
  },
  render() {
    const renderTab = (name: string, count: number) => {
      return count ? (
        <div class="tab" style={{ height: "25px" }}>
          {name} ({count})
        </div>
      ) : undefined;
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
    return (
      <div class="right-drawer">
        <div class="header">
          {this.$t("right-drawer.server-members", [
            this.serverMembersArr.length,
          ])}
        </div>
        <div class="members" key={this.tempServerId}>
          <virtual-list
            ref="virtualList"
            size={260}
            remain={this.remain}
            variable={true}
            key={this.remain}
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
  mounted() {
    this.updateTempServerId();
  },
  methods: {
    updateTempServerId() {
      window.setTimeout(() => {
        this.tempServerId = this.serverId;
      }, 100);
    },
  },
  watch: {
    serverId() {
      this.updateTempServerId();
    },
    list: {
      deep: true,
      handler() {
        (this.$refs.virtualList as any).forceRender();
      },
    },
  },
  computed: {
    serverMembersArr(): ServerMember[] {
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
    serverMembers(): { [key: string]: ServerMember } {
      return ServerMembersModule.serverMembers[this.tempServerId || ""];
    },
    list(): any[] {
      const unConsumedMembers = this.serverMembersArr.map((sm) => sm.id);
      const roleMembers = this.serverRoles
        .filter((r) => !r.hideRole)
        .map((role) => {
          const members = [...unConsumedMembers].filter((id) => {
            if (!unConsumedMembers.includes(id)) return false;
            const member = this.serverMembers[id];
            if (!member.roleIdArr.includes(role.id)) return false;
            if (!PresencesModule.getPresence(id)) return false;
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
      const onlineMembers = [...unConsumedMembers].filter((id) => {
        if (!PresencesModule.getPresence(id)) return;
        unConsumedMembers.splice(unConsumedMembers.indexOf(id), 1);
        return true;
      });
      const offlineMembers = Object.values(unConsumedMembers);

      const defaultRoleTitle = {
        title: this.defaultRole?.name || "Online",
        id: this.defaultRole?.id || "loading",
        count: onlineMembers.length,
      };
      const offlineTitle = {
        title: "Offline",
        id: "oof",
        count: offlineMembers.length,
      };

      return [
        ...roleMembers,
        defaultRoleTitle,
        ...onlineMembers,
        offlineTitle,
        ...offlineMembers,
      ];
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
    },
  },
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
