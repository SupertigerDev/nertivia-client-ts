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
import Vue from "vue";
import { addPerm } from "@/constants/rolePermissions";

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

  get addAllRolePermissions() {
    return (server_id: string, roleIdArr: string[]) => {
      const serverRoles = this.serverRoles[server_id];
      let perms = 0;
      if (!serverRoles) return 0;
      for (let i = 0; i < roleIdArr.length; i++) {
        const role = serverRoles.find(r => r.id === roleIdArr[i]);
        if (!role) continue;
        perms = addPerm(perms, role.permissions);
      }
      return perms;
    };
  }

  get defaultServerRole() {
    return (server_id: string) => {
      return this.serverRoles[server_id].find(role => role.default);
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
  private ADD_SERVER_ROLES(payload: { roles: ServerRole; serverID: string }) {
    Vue.set(this.serverRoles, payload.serverID, payload.roles);
  }

  @Action
  public AddServerRoles(payload: { roles: ServerRole; serverID: string }) {
    this.ADD_SERVER_ROLES(payload);
  }
  @Mutation
  private ADD_SERVER_ROLE(payload: ServerRole) {
    const roles = this.serverRoles[payload.server_id] || [];
    roles.push(payload);
    Vue.set(this.serverRoles, payload.server_id, roles);
  }

  @Action
  public AddServerRole(payload: ServerRole) {
    this.ADD_SERVER_ROLE(payload);
  }

  @Mutation
  private UPDATE_SERVER_ROLE(payload: Partial<ServerRole>) {
    if (!payload.server_id) return;
    if (!payload.id) return;
    const roleIndex = this.serverRoles?.[payload.server_id]?.findIndex(r => r.id === payload.id);
    if (roleIndex < 0 || roleIndex === undefined) return;
    const role = this.serverRoles?.[payload.server_id]?.[roleIndex];

    Vue.set(this.serverRoles[payload.server_id], roleIndex , {...role, ...payload});
  }

  @Action
  public UpdateServerRole(payload: Partial<ServerRole>) {
    this.UPDATE_SERVER_ROLE(payload);
  }
  @Mutation
  private DELETE_SERVER_ROLE(payload: {server_id: string, role_id: string}) {
    const roleIndex = this.serverRoles?.[payload.server_id]?.findIndex(r => r.id === payload.role_id);
    if (roleIndex === -1 || roleIndex === undefined) return;
    Vue.delete(this.serverRoles[payload.server_id], roleIndex);
  }

  @Action
  public DeleteServerRole(payload: {server_id: string, role_id: string}) {
    this.DELETE_SERVER_ROLE(payload);
  }
}
export const ServerRolesModule = getModule(ServerRoles);
