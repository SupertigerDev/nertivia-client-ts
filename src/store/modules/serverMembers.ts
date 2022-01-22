import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import ServerMember, { ExtraServerMembers } from "@/interfaces/ServerMember";
import { UsersModule } from "./users";
import { PresencesModule } from "./presences";
import { ServerRolesModule } from "./serverRoles";

import _ from "lodash";
import { permissions } from "@/constants/rolePermissions";
import { bitwiseAdd, bitwiseContains } from "@/utils/bitwise";
import ServerRole from "@/interfaces/ServerRole";
import User from "@/interfaces/User";

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

  get getUsersFromServer() {
    return (server_id: string) => {
      if (!this.serverMembers[server_id]) return [];
      return Object.values(this.serverMembers[server_id]).map((sm) => {
        return UsersModule.users[sm.id];
      });
    };
  }

  get serverMember() {
    return (server_id: string, id: string): ExtraServerMembers | undefined => {
      if (!this.serverMembers[server_id]) return undefined;
      const sm = this.serverMembers[server_id][id];
      if (!sm) return undefined;
      const user = UsersModule.users[id];
      const roles = ServerRolesModule.bulkRolesById(server_id, sm.roleIdArr);
      const presence = PresencesModule.getPresence(id);
      return { member: user, ...sm, presence, roles };
    };
  }
  get filteredServerMembers() {
    return (server_id: string): ExtraServerMembers[] => {
      if (!this.serverMembers[server_id]) return [];
      return Object.values(this.serverMembers[server_id]).map((sm) => {
        const user = UsersModule.users[sm.id];
        const roles = ServerRolesModule.bulkRolesById(server_id, sm.roleIdArr);
        const presence = PresencesModule.getPresence(sm.id);
        return { member: user, ...sm, presence, roles };
      });
    };
  }

  get memberHasRole() {
    return (server_id: string, id: string, roleID: string) => {
      const member = this.serverMembers[server_id]?.[id];
      if (!member) return undefined;
      return member.roleIdArr.includes(roleID);
    };
  }

  /**
   * gets the roles of a member in a server
   */
  get memberRoles() {
    return (server_id: string, id: string) => {
      const member = this.serverMembers[server_id]?.[id];
      if (member) {
        return ServerRolesModule.bulkRolesById(server_id, member.roleIdArr);
      }
    };
  }
  get highestRoleOrder() {
    return (server_id: string, id: string) => {
      const roles = this.memberRoles(server_id, id);
      if (!roles) return undefined;
      return Math.min(...roles.map((r) => r.order));
    };
  }

  get firstMemberRole() {
    return (server_id: string, id: string) => {
      const member = this.serverMembers[server_id]?.[id];
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
    return (
      id: string,
      serverID: string,
      flag: number,
      includeAdminPerm = true
    ) => {
      if (includeAdminPerm) {
        flag = bitwiseAdd(flag, permissions.ADMIN.value);
      }
      const member = this.serverMembers[serverID]?.[id];
      if (!member) return 0;
      const defaultRole = ServerRolesModule.defaultServerRole(serverID);
      let perms = defaultRole?.permissions || 0;
      perms = bitwiseAdd(
        perms,
        ServerRolesModule.addAllRolePermissions(serverID, member.roleIdArr)
      );
      return !!bitwiseContains(perms, flag);
    };
  }
  get isAdmin() {
    return (id?: string, serverID?: string) => {
      if (!id) return false;
      if (!serverID) return false;
      return this.memberHasPermission(id, serverID, permissions.ADMIN.value);
    };
  }

  @Mutation
  private UPDATE_MEMBER_ROLES(payload: {
    server_id: string;
    id: string;
    member: ServerMember;
  }) {
    this.serverMembers[payload.server_id][payload.id] = payload.member;
  }
  @Action
  public RemoveMemberRole(payload: {
    serverID: string;
    id: string;
    roleID: string;
  }) {
    const member = this.serverMembers[payload.serverID][payload.id];
    if (!member) return;
    const newRoleIdArr = member.roleIdArr.filter((r) => r !== payload.roleID);

    this.UPDATE_MEMBER_ROLES({
      id: payload.id,
      server_id: payload.serverID,
      member: { ...member, roleIdArr: newRoleIdArr },
    });
  }

  @Action
  public AddMemberRole(payload: {
    serverID: string;
    id: string;
    roleID: string;
  }) {
    const mem = this.serverMembers[payload.serverID][payload.id];
    if (!mem) return;
    const member = _.clone(mem);
    if (member.roleIdArr) {
      member.roleIdArr.push(payload.roleID);
    } else {
      member.roleIdArr = [payload.roleID];
    }
    this.UPDATE_MEMBER_ROLES({
      id: payload.id,
      server_id: payload.serverID,
      member,
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
    this.serverMembers = { ...this.serverMembers, ...payload };
  }

  @Action
  public AddServerMembers(payload: Servers) {
    this.ADD_SERVER_MEMBERS(payload);
  }
  @Mutation
  private ADD_SERVER_MEMBER(payload: ServerMember) {
    if (this.serverMembers[payload.server_id]) {
      this.serverMembers[payload.server_id][payload.id] = payload;
      return;
    }
    this.serverMembers[payload.server_id] = {
      [payload.id]: payload,
    };
  }

  @Action
  public AddServerMember(payload: ServerMember) {
    this.ADD_SERVER_MEMBER(payload);
  }
  @Mutation
  private REMOVE_SERVER_MEMBER(payload: { server_id: string; id: string }) {
    const serverMembers = this.serverMembers[payload.server_id];
    if (!serverMembers) return;
    delete this.serverMembers[payload.server_id][payload.id];
  }

  @Action
  public RemoveServerMember(payload: { server_id: string; id: string }) {
    this.REMOVE_SERVER_MEMBER(payload);
  }

  @Mutation
  private REMOVE_ALL_SERVER_MEMBERS(serverID: string) {
    delete this.serverMembers[serverID];
  }

  @Action
  public RemoveAllServerMembers(serverID: string) {
    this.REMOVE_ALL_SERVER_MEMBERS(serverID);
  }
}
export const ServerMembersModule = getModule(ServerMembers);
