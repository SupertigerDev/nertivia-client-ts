import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import ServerRole from "@/interfaces/ServerRole";

import { bitwiseAdd } from "@/utils/bitwise";

// ServerRoleObj[server_id][role_id] = serverRole
interface ServerRoleObj {
  [key: string]: {
    [key: string]: ServerRole;
  };
}

@Module({ dynamic: true, store, namespaced: true, name: "serverRoles" })
class ServerRoles extends VuexModule {
  serverRoles: ServerRoleObj = {};

  get bulkRolesById() {
    return (server_id: string, roleIdArr: string[]) => {
      const serverRoles = this.sortedServerRolesArr(server_id);
      if (!serverRoles) return [];
      return serverRoles.filter((role) => roleIdArr.includes(role.id));
    };
  }

  get sortedServerRolesArr() {
    return (server_id: string) => {
      // sort server roles by order
      if (!this.serverRoles[server_id]) return [];
      const serverRoles = Object.values(this.serverRoles[server_id]);
      return serverRoles.sort((a: any, b: any) => {
        return a.order - b.order;
      });
    };
  }

  get addAllRolePermissions() {
    return (server_id: string, roleIdArr: string[]) => {
      const serverRoles = this.sortedServerRolesArr(server_id);
      let perms = 0;
      if (!serverRoles) return 0;
      for (let i = 0; i < roleIdArr.length; i++) {
        const role = serverRoles.find((r) => r.id === roleIdArr[i]);
        if (!role) continue;
        perms = bitwiseAdd(perms, role.permissions);
      }
      return perms;
    };
  }

  get defaultServerRole() {
    return (server_id: string) => {
      const serverRoles = Object.values(this.serverRoles?.[server_id] || {});
      return serverRoles.find((role) => role.default);
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
  @Mutation
  private ADD_SERVER_ROLES(payload: {
    roles: { [key: string]: ServerRole };
    serverID: string;
  }) {
    this.serverRoles[payload.serverID] = payload.roles;
  }

  @Action
  public AddServerRoles(payload: {
    roles: { [key: string]: ServerRole };
    serverID: string;
  }) {
    this.ADD_SERVER_ROLES(payload);
  }
  @Mutation
  private ADD_SERVER_ROLE(payload: ServerRole) {
    if (!this.serverRoles[payload.server_id]) {
      this.serverRoles[payload.server_id] = { [payload.id]: payload };
      return;
    }
    this.serverRoles[payload.server_id][payload.id] = payload;
  }

  @Action
  public AddServerRole(payload: ServerRole) {
    this.ADD_SERVER_ROLE(payload);
  }

  @Mutation
  private UPDATE_SERVER_ROLE(payload: Partial<ServerRole>) {
    if (!payload.server_id) return;
    if (!payload.id) return;
    const role = this.serverRoles?.[payload.server_id]?.[payload.id];
    if (!role) return;
    this.serverRoles[payload.server_id][role.id] = {
      ...role,
      ...payload,
    };
  }

  @Action
  public UpdateServerRole(payload: Partial<ServerRole>) {
    this.UPDATE_SERVER_ROLE(payload);
  }
  @Mutation
  private DELETE_SERVER_ROLE(payload: { server_id: string; role_id: string }) {
    delete this.serverRoles[payload.server_id][payload.role_id];
  }

  @Action
  public DeleteServerRole(payload: { server_id: string; role_id: string }) {
    this.DELETE_SERVER_ROLE(payload);
  }

  @Mutation
  private DELETE_ALL_SERVER_ROLES(serverID: string) {
    delete this.serverRoles[serverID];
  }

  @Action
  public DeleteAllServerRoles(serverID: string) {
    this.DELETE_ALL_SERVER_ROLES(serverID);
  }
}
export const ServerRolesModule = getModule(ServerRoles);
