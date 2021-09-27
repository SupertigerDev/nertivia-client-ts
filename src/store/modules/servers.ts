import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import Server from "@/interfaces/Server";
import { saveCache } from "@/utils/localCache";

interface ServerObj {
  [key: string]: Server;
}

@Module({ dynamic: true, store, namespaced: true, name: "servers" })
class Servers extends VuexModule {
  servers: ServerObj = {};
  serverPosition: string[] = [];

  get sortedServers() {
    const servers = Object.values(this.servers);
    if (!this.serverPosition) return servers;
    const tempServers = [...servers];
    const sortServers: Server[] = [];
    for (let i = 0; i < this.serverPosition.length; i++) {
      const serverID = this.serverPosition[i];
      const index = tempServers.findIndex((s) => s.server_id === serverID);
      if (index < 0) continue;
      sortServers.push(tempServers[index]);
      tempServers.splice(index, 1);
    }
    return [...tempServers, ...sortServers];
  }
  get isServerOwner() {
    return (serverID: string, id: string) => {
      return this.servers[serverID]?.creator?.id === id;
    };
  }
  @Mutation
  private INIT_SERVERS(payload: ServerObj | any) {
    this.servers = payload;
  }

  @Action
  public InitServers(payload: ServerObj | any) {
    saveCache("servers", payload);
    this.INIT_SERVERS(payload);
  }
  @Mutation
  private ADD_SERVER(payload: Server) {
    this.servers[payload.server_id] = payload;
  }

  @Action
  public AddServer(payload: Server) {
    this.ADD_SERVER(payload);
  }
  @Mutation
  private UPDATE_SERVER(payload: Partial<Server>) {
    if (!payload.server_id) return;
    const server = this.servers[payload.server_id || ""];
    if (!server) return;
    this.servers[payload.server_id] = { ...server, ...payload };
  }

  @Action
  public UpdateServer(payload: Partial<Server>) {
    this.UPDATE_SERVER(payload);
  }
  @Mutation
  private DELETE_SERVER(serverID: string) {
    delete this.servers[serverID];
  }

  @Action
  public DeleteServer(serverID: string) {
    this.DELETE_SERVER(serverID);
  }
  @Mutation
  private SET_SERVER_POSITIONS(serverPositionArr: string[]) {
    this.serverPosition = serverPositionArr;
  }

  @Action
  public SetServerPositions(serverPositionArr: string[]) {
    saveCache("serverPositions", serverPositionArr);

    this.SET_SERVER_POSITIONS(serverPositionArr);
  }
}
export const ServersModule = getModule(Servers);
