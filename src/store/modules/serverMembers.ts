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

@Module({ dynamic: true, store, namespaced: true, name: "serverMembers" })
class ServerMembers extends VuexModule {
  serverMembers: ServerMember[] = [];

  get filteredServerMembers() {
    return (server_id: string) => {
      return this.serverMembers
        .filter(sm => sm.server_id === server_id)
        .map(sm => {
          const user = UsersModule.users[sm.uniqueID];
          const roles = ServerRolesModule.bulkRolesById(
            server_id,
            sm.roleIdArr
          );
          const presence = PresencesModule.presences[sm.uniqueID];
          return { member: user, ...sm, presence, roles };
        });
    };
  }

  get firstMemberRole() {
    return (server_id: string, uniqueID: string) => {
      const member = this.serverMembers.find(
        sm => sm.server_id === server_id && sm.uniqueID === uniqueID
      );
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
      const member = this.serverMembers.find(
        sm => sm.server_id === serverID && sm.uniqueID === uniqueID
      );
      if (!member) return 0;
      const defaultRole = ServerRolesModule.defaultServerRole(serverID);
      let perms = defaultRole?.permissions || 0;
      perms =
        perms |
        ServerRolesModule.addAllRolePermissions(serverID, member.roleIdArr);
      return !!(perms & flag);
    };
  }

  @Mutation
  private INIT_SERVER_MEMBERS(payload: ServerMember[]) {
    this.serverMembers = payload;
  }

  @Action
  public InitServerMembers(payload: ServerMember[]) {
    // filter duplicates
    const filteredArr = payload.reduce<ServerMember[]>((acc, current) => {
      const x = acc.find(
        item =>
          item.server_id === current.server_id &&
          item.uniqueID === current.uniqueID
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    saveCache("serverMembers", filteredArr);
    this.INIT_SERVER_MEMBERS(filteredArr);
  }
}
export const ServerMembersModule = getModule(ServerMembers);
