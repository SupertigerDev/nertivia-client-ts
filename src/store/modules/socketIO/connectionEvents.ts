import { ActionTree } from "vuex";
import Vue from "vue";
import User from "@/interfaces/User";
import { MeModule } from "../me";
import { UsersModule } from "../users";
import { FriendsModule } from "../friends";
import { ServersModule } from "../servers";
import { ChannelsModule } from "../channels";
import { ServerMembersModule } from "../serverMembers";
import { PresencesModule } from "../presences";
import ServerRole from "@/interfaces/ServerRole";
import { ServerRolesModule } from "../serverRoles";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;

interface SuccessEvent {
  user: MeUser;
  serverMembers: ReturnedServerMember[];
  memberStatusArr: any[];
  serverRoles: ServerRole[];
}

interface MeUser {
  username: string;
  uniqueID: string;
  email: string;
  tag: string;
  admin: number;
  avatar?: string | null;
  friends: Friend[];
  servers: ReturnedServer[];
}
interface Friend {
  status: number;
  recipient: User;
}
interface ReturnedServerMember {
  member: User;
  server_id: string;
  type: string;
  roles: string[];
}

interface ReturnedServer {
  avatar: string;
  banner: string;
  channel_position: string[];
  channels: ReturnedChannel[];
  creator: {
    uniqueID: string;
  };
  default_channel_id: string;
  name: string;
  server_id: string;
  verified: boolean;
}
interface ReturnedChannel {
  channelID: string;
  name?: string;
  server_id?: string;
}

const actions: ActionTree<any, any> = {
  socket_connect() {
    MeModule.SetConnectionDetails({
      connected: false,
      message: "Connecting..."
    });
    socket().emit("authentication", {
      token: localStorage.getItem("hauthid")
    });
  },
  socket_authErr(context, data) {
    MeModule.SetConnectionDetails({ connected: false, message: data });
  },
  socket_disconnect() {
    MeModule.SetConnectionDetails({connected: false, message: "Connecting..."})
  },
  socket_success(context, data: SuccessEvent) {
    MeModule.SetConnectionDetails({ connected: true, message: null });
    MeModule.SetUser({
      email: data.user.email,
      username: data.user.username,
      avatar: data.user.avatar,
      tag: data.user.tag,
      uniqueID: data.user.uniqueID
    });

    // set friends
    const users: any = {};
    const friends: any = {};
    for (let i = 0; i < data.user.friends.length; i++) {
      const friend = data.user.friends[i];
      const user = friend.recipient;
      users[user.uniqueID] = user;
      friends[user.uniqueID] = { status: friend.status };
    }

    // set servers
    const servers: any = {};
    const channels: any = {};
    for (let i = 0; i < data.user.servers.length; i++) {
      const server = data.user.servers[i];
      servers[server.server_id] = {
        avatar: server.avatar,
        banner: server.banner,
        creator: server.creator,
        default_channel_id: server.default_channel_id,
        name: server.name,
        server_id: server.server_id,
        verified: server.verified
      };
      for (let x = 0; x < server.channels.length; x++) {
        const channel = server.channels[x];
        channels[channel.channelID] = {
          channelID: channel.channelID,
          name: channel.name,
          server_id: channel.server_id
        };
      }
    }
    // server members
    const serverMembers: any[] = [];
    for (let i = 0; i < data.serverMembers.length; i++) {
      const serverMember = data.serverMembers[i];
      serverMembers.push({
        type: serverMember.type,
        uniqueID: serverMember.member.uniqueID,
        server_id: serverMember.server_id,
        roleIdArr: serverMember.roles || []
      });
      users[serverMember.member.uniqueID] = serverMember.member;
    }

    const presenceObj: any = {};
    for (let i = 0; i < data.memberStatusArr.length; i++) {
      const uniqueID = data.memberStatusArr[i][0];
      const status = data.memberStatusArr[i][1];
      presenceObj[uniqueID] = parseInt(status);
    }

    const serverRolesObj: any = {};
    for (let i = 0; i < data.serverRoles.length; i++) {
      const role = data.serverRoles[i];
      if (serverRolesObj[role.server_id]) {
        serverRolesObj[role.server_id].push(role);
        continue;
      }
      serverRolesObj[role.server_id] = [role];
    }
    // sort server roles by order
    for (let i = 0; i < Object.keys(serverRolesObj).length; i++) {
      const server_id = Object.keys(serverRolesObj)[i];
      serverRolesObj[server_id] = serverRolesObj[server_id].sort(
        (a: any, b: any) => {
          return a.order - b.order;
        }
      );
    }

    ServerRolesModule.InitServerRoles(serverRolesObj);
    PresencesModule.InitPresences(presenceObj);
    ServerMembersModule.InitServerMembers(serverMembers);
    UsersModule.InitUsers(users);
    FriendsModule.InitFriends(friends);
    ServersModule.InitServers(servers);
    ChannelsModule.InitChannels(channels);
  }
};
export default {
  actions
};
