import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import ServerMember from "@/interfaces/ServerMember";
import { UsersModule } from "./users";
import { PresencesModule } from "./presences";
import { ServerRolesModule } from "./serverRoles";
import Vue from "vue";
import _ from "lodash";
import {addPerm, containsPerm, permissions} from "@/constants/rolePermissions";

interface Servers {
  [key: string]: Members;
}
interface Members {
  [key: string]: ServerMember;
}

@Module({ dynamic: true, store, namespaced: true, name: "serverMembers" })
class ServerMembers extends VuexModule {
  // serverMembers[server_id][unique_id]
  serverMembers: Servers = {};

  get filteredServerMembers() {
    return (server_id: string) => {
      if (!this.serverMembers[server_id]) return [];
      return Object.values(this.serverMembers[server_id]).map(sm => {
        const user = UsersModule.users[sm.uniqueID];
        const roles = ServerRolesModule.bulkRolesById(server_id, sm.roleIdArr);
        const presence = PresencesModule.getPresence(sm.uniqueID);
        return { member: user, ...sm, presence, roles };
      });
    };
  }

  get memberHasRole() {
    return (server_id: string, uniqueID: string, roleID: string) => {
      const member = this.serverMembers[server_id]?.[uniqueID];
      if (!member) return undefined;
      return member.roleIdArr.includes(roleID);
    };
  }

  get firstMemberRole() {
    return (server_id: string, uniqueID: string) => {
      const member = this.serverMembers[server_id]?.[uniqueID];
      if (!member) return undefined;
      const roles = ServerRolesModule.bulkRolesById(
        server_id,
        member.roleIdArr
      );
      if (roles[0]) return roles[0];
      return ServerRolesModule.defaultServerRole(server_id);
    };
  }

  get memberHasPermission() {
    return (uniqueID: string, serverID: string, flag: number) => {
      const member = this.serverMembers[serverID]?.[uniqueID];
      if (!member) return 0;
      const defaultRole = ServerRolesModule.defaultServerRole(serverID);
      let perms = defaultRole?.permissions || 0;
      perms = addPerm(perms, ServerRolesModule.addAllRolePermissions(serverID, member.roleIdArr));
      return !!containsPerm(perms, flag)
    };
  }
  get isAdmin() {
    return (uniqueID?: string, serverID?: string) => {
      if (!uniqueID) return false;
      if (!serverID) return false;
      return this.memberHasPermission(
        uniqueID,
        serverID,
        permissions.ADMIN.value
      );
    };
  }

  @Mutation
  private UPDATE_MEMBER_ROLES(payload: {
    server_id: string;
    uniqueID: string;
    member: ServerMember;
  }) {
    Vue.set(
      this.serverMembers[payload.server_id],
      payload.uniqueID,
      payload.member
    );
  }
  @Action
  public RemoveMemberRole(payload: {
    serverID: string;
    uniqueID: string;
    roleID: string;
  }) {
    const mem = this.serverMembers[payload.serverID][payload.uniqueID];
    if (!mem) return;
    const member = _.clone(mem);
    member.roleIdArr = member.roleIdArr.filter(r => r !== payload.roleID);

    this.UPDATE_MEMBER_ROLES({
      uniqueID: payload.uniqueID,
      server_id: payload.serverID,
      member
    });
  }

  @Action
  public AddMemberRole(payload: {
    serverID: string;
    uniqueID: string;
    roleID: string;
  }) {
    const mem = this.serverMembers[payload.serverID][payload.uniqueID];
    if (!mem) return;
    const member = _.clone(mem);
    if (member.roleIdArr) {
      member.roleIdArr.push(payload.roleID);
    } else {
      member.roleIdArr = [payload.roleID];
    }
    this.UPDATE_MEMBER_ROLES({
      uniqueID: payload.uniqueID,
      server_id: payload.serverID,
      member
    });
  }

  @Mutation
  private INIT_SERVER_MEMBERS(payload: Servers) {
    this.serverMembers = payload;
  }

  @Action
  public InitServerMembers(payload: Servers) {
    saveCache("serverMembers", payload);
    this.INIT_SERVER_MEMBERS(payload);
  }
  @Mutation
  private ADD_SERVER_MEMBERS(payload: Servers) {
    Vue.set(this, "serverMembers", { ...this.serverMembers, ...payload });
  }

  @Action
  public AddServerMembers(payload: Servers) {
    this.ADD_SERVER_MEMBERS(payload);
  }
  @Mutation
  private ADD_SERVER_MEMBER(payload: ServerMember) {
    if (this.serverMembers[payload.server_id]) {
      Vue.set(this.serverMembers[payload.server_id], payload.uniqueID, payload);
      return;
    }
    Vue.set(this.serverMembers, payload.server_id, { [payload.uniqueID]:  payload});
  }

  @Action
  public AddServerMember(payload: ServerMember) {
    this.ADD_SERVER_MEMBER(payload);
  }
  @Mutation
  private REMOVE_SERVER_MEMBER(payload: {server_id: string, uniqueID: string}) {
    Vue.delete(this.serverMembers[payload.server_id], payload.uniqueID);
  }

  @Action
  public RemoveServerMember(payload: {server_id: string, uniqueID: string}) {
    this.REMOVE_SERVER_MEMBER(payload);
  }
}
export const ServerMembersModule = getModule(ServerMembers);
