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
import { MessagesModule } from "../messages";
import {
  SERVER_ADD_ROLE,
  SERVER_CREATE_ROLE,
  SERVER_JOINED,
  SERVER_LEAVE,
  SERVER_MEMBERS,
  SERVER_MEMBER_ADD,
  SERVER_MEMBER_REMOVE,
  SERVER_MEMBER_REMOVE_ROLE,
  SERVER_MUTE,
  SERVER_POSITION,
  SERVER_REMOVE_ROLE,
  SERVER_ROLES,
  SERVER_UPDATE_ROLE,
  SERVER_UPDATE_ROLES
} from "@/socketEventConstants";

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
  };
}

const actions: ActionTree<any, any> = {
  [SERVER_POSITION](context, data: { server_position: string[] }) {
    // const servers = ServersModule.servers;
    // let sortServers = {};
    // for (let i = 0; i < data.server_position.length; i++) {
    //   const serverID = data.server_position[i];
    //   sortServers = {
    //     [serverID]: servers[serverID],
    //     ...sortServers
    //   };
    // }
    // ServersModule.InitServers(sortServers);
    ServersModule.SetServerPositions(data.server_position);
  },
  [SERVER_ADD_ROLE](context, data: ServerMemberAddOrRemoveRole) {
    ServerMembersModule.AddMemberRole({
      serverID: data.server_id,
      uniqueID: data.uniqueID,
      roleID: data.role_id
    });
  },
  [SERVER_JOINED](context, data: any) {
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
        lastMessaged: channel.lastMessaged,
        permissions: channel.permissions,
        rateLimit: channel.rateLimit
      };
    }
    ChannelsModule.AddChannels(channelObj);
    if (socket().id === socketID) {
      router.push(`/app/servers/${data.server_id}/${data.default_channel_id}`);
    }
  },
  [SERVER_LEAVE](context, data: { server_id: string }) {
    ServersModule.DeleteServer(data.server_id);
    MessagesModule.DeleteServerMessages(data.server_id);
    ChannelsModule.DeleteAllServerChannels(data.server_id);
    ServerRolesModule.DeleteAllServerRoles(data.server_id);
    ServerMembersModule.RemoveAllServerMembers(data.server_id);

    if (router.currentRoute.params?.server_id === data.server_id) {
      router.push("/app");
    }
  },
  [SERVER_MEMBERS](
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
      serverMembersObj[serverMember.server_id][
        serverMember.member.uniqueID
      ] = filterServerMemberKeys(serverMember);
      usersObj[serverMember.member.uniqueID] = serverMember.member;
    }

    UsersModule.AddUsers(usersObj);
    ServerMembersModule.AddServerMembers(serverMembersObj);
  },
  [SERVER_MEMBER_ADD](context, { serverMember }) {
    UsersModule.AddUser(serverMember.member);
    ServerMembersModule.AddServerMember(filterServerMemberKeys(serverMember));
  },
  [SERVER_MEMBER_REMOVE](context, { uniqueID, server_id }) {
    ServerMembersModule.RemoveServerMember({ uniqueID, server_id });
  },
  [SERVER_ROLES](context, { roles, server_id }) {
    const serverRolesObj: any = {};
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      serverRolesObj[role.id] = role;
    }
    ServerRolesModule.AddServerRoles({
      roles: serverRolesObj,
      serverID: server_id
    });
  },
  [SERVER_UPDATE_ROLES](context, { roles, server_id }) {
    const serverRolesObj: any = {};
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      serverRolesObj[role.id] = role;
    }
    ServerRolesModule.AddServerRoles({
      roles: serverRolesObj,
      serverID: server_id
    });
  },
  [SERVER_CREATE_ROLE](context, role) {
    ServerRolesModule.AddServerRole(role);
  },
  [SERVER_UPDATE_ROLE](context, partialRole) {
    ServerRolesModule.UpdateServerRole(partialRole);
  },
  [SERVER_REMOVE_ROLE](context, { role_id, server_id }) {
    ServerRolesModule.DeleteServerRole({ role_id, server_id });
  },
  [SERVER_MEMBER_REMOVE_ROLE](context, data: ServerMemberAddOrRemoveRole) {
    ServerMembersModule.RemoveMemberRole({
      serverID: data.server_id,
      uniqueID: data.uniqueID,
      roleID: data.role_id
    });
  },
  [SERVER_MUTE](context, data: { muted: number; server_id: string }) {
    MutedServersModule.SetMutedServer({
      serverID: data.server_id,
      type: data.muted
    });
  }
};
export default {
  actions
};
