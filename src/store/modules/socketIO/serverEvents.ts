import { ActionTree } from "vuex";
import { ServerMembersModule } from "../serverMembers";
import { ServerRolesModule } from "../serverRoles";
import { ServersModule } from "../servers";

interface ServerMemberAddOrRemoveRole {
  role_id: string;
  server_id: string;
  uniqueID: string;
}

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
  },
  ["socket_serverMember:addRole"](context, data: ServerMemberAddOrRemoveRole) {
    ServerMembersModule.AddMemberRole({
      serverID: data.server_id,
      uniqueID: data.uniqueID,
      roleID: data.role_id
    });
  },
  ["socket_serverMember:removeRole"](
    context,
    data: ServerMemberAddOrRemoveRole
  ) {
    ServerMembersModule.RemoveMemberRole({
      serverID: data.server_id,
      uniqueID: data.uniqueID,
      roleID: data.role_id
    });
  }
};
export default {
  actions
};
