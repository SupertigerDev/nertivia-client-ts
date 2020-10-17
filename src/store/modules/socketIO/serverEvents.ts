import { ActionTree } from "vuex";
import { ServersModule } from "../servers";

const actions: ActionTree<any, any> = {
  ["socket_self:serverPosition"](context, data: { server_position: string[] }) {
    const servers = ServersModule.servers;
    let sortServers = {};
    for (let i = 0; i < data.server_position.length; i++) {
      const serverID = data.server_position[i];
      sortServers = {
        [serverID]: servers[serverID],
        ...sortServers
      };
    }
    ServersModule.InitServers(sortServers);
  }
};
export default {
  actions
};
