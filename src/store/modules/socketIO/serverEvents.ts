import Channel from "@/interfaces/Channel";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { ServerMembersModule } from "../serverMembers";
import { ServerRolesModule } from "../serverRoles";
import { ServersModule } from "../servers";
import Vue from "vue";
import router from "@/router";
import { UsersModule } from "../users";
import { MutedServersModule } from "../mutedServers";
import { deleteMessage } from "@/services/messagesService";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;

interface ServerMemberAddOrRemoveRole {
  role_id: string;
  server_id: string;
  uniqueID: string;
}

function filterServerMemberKeys(serverMember: any) {
  return {
    type: serverMember.type,
    uniqueID: serverMember.member.uniqueID,
    server_id: serverMember.server_id,
    roleIdArr: serverMember.roles || []
  }
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
  ["socket_server:joined"](context, data: any) {
    const channels: Channel[] = data.channels;
    const socketID: string | undefined = data.socketID;
    ServersModule.AddServer({
      avatar: data.avatar,
      banner: data.banner,
      default_channel_id: data.default_channel_id,
      creator: data.creator,
      verified: data.verified,
      channel_position: data.channel_position,
      name: data.name,
      server_id: data.server_id
    });

    const channelObj: any = {};
    for (let x = 0; x < channels.length; x++) {
      const channel = channels[x];
      channelObj[channel.channelID] = {
        channelID: channel.channelID,
        name: channel.name,
        server_id: channel.server_id,
        lastMessaged: channel.lastMessaged
      };
    }
    ChannelsModule.AddChannels(channelObj);
    if (socket().id === socketID) {
      router.push(`/app/servers/${data.server_id}/${data.default_channel_id}`);
    }
  },
  ["socket_server:members"](
    context,
    {
      serverMembers,
      memberPresences,
      memberCustomStatusArr,
      programActivityArr
    }
  ) {
    const serverMembersObj: any = {};
    const usersObj: any = {};
    for (let i = 0; i < serverMembers.length; i++) {
      const serverMember = serverMembers[i];

      if (!serverMembersObj[serverMember.server_id]) {
        serverMembersObj[serverMember.server_id] = {};
      }
      serverMembersObj[serverMember.server_id][serverMember.member.uniqueID] = filterServerMemberKeys(serverMember);
      usersObj[serverMember.member.uniqueID] = serverMember.member;
    }

    UsersModule.AddUsers(usersObj);
    ServerMembersModule.AddServerMembers(serverMembersObj);
  },
  ["socket_server:memberAdd"](context, {serverMember}) {
    UsersModule.AddUser(serverMember.member);
    ServerMembersModule.AddServerMember(filterServerMemberKeys(serverMember));
  },
  ["socket_server:roles"](context, { roles, server_id }) {
    // sort server roles by order
    const orderedRoles = roles.sort((a: any, b: any) => {
      return a.order - b.order;
    });
    ServerRolesModule.AddServerRoles({
      roles: orderedRoles,
      serverID: server_id
    });
  },
  ["socket_server:createRole"](context, role) {
    ServerRolesModule.AddServerRole(role);
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
  },
  ["socket_server:mute"](context, data: { muted: number; server_id: string }) {
    MutedServersModule.SetMutedServer({
      serverID: data.server_id,
      type: data.muted
    });
  }
};
export default {
  actions
};
