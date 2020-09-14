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
