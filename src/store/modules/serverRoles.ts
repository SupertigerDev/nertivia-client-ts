import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import ServerRole from "@/interfaces/ServerRole";

// ServerRoleObj[server_id] = serverRole[]
interface ServerRoleObj {
  [key: string]: ServerRole[];
}

@Module({ dynamic: true, store, namespaced: true, name: "serverRoles" })
class ServerRoles extends VuexModule {
  serverRoles: ServerRoleObj = {};

  get bulkRolesById() {
    return (server_id: string, roleIdArr: string[]) => {
      if (!this.serverRoles[server_id]) return [];
      return this.serverRoles[server_id].filter(
        role => server_id === role.server_id && roleIdArr.includes(role.id)
      );
    };
  }

  @Mutation
  private INIT_SERVER_ROLES(payload: ServerRoleObj | any) {
    this.serverRoles = payload;
  }

  @Action
  public InitServerRoles(payload: ServerRoleObj | any) {
    saveCache("serverRoles", payload);
    this.INIT_SERVER_ROLES(payload);
  }
}
export const ServerRolesModule = getModule(ServerRoles);
