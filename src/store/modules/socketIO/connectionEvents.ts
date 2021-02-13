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
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";
import { MutedChannelsModule } from "../mutedChannels";
import { isObjectLike } from "lodash";
import { MutedServersModule } from "../mutedServers";
import CustomEmoji from "@/interfaces/CustomEmoji";
import { CustomEmojisModule } from "../customEmojis";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;

interface SuccessEvent {
  user: MeUser;
  serverMembers: ReturnedServerMember[];
  memberStatusArr: any[];
  dms: ReturnedDmChannel[];
  serverRoles: ServerRole[];
  lastSeenServerChannels: LastSeenServerChannels;
  notifications: Notification[];
  settings: Settings;
  mutedChannels: string[];
  mutedServers: { muted: number; server_id: string }[];
}
interface Settings {
  server_position: string[];
  customEmojis: CustomEmoji[];
}

interface Notification {
  channelID: string;
  count: number;
  lastMessageID: string;
  mentioned: boolean;
  recipient: string;
  sender: User;
  type: string;
}
interface LastSeenServerChannels {
  [key: string]: number;
}

interface ReturnedDmChannel {
  lastMessaged: number;
  channelID: string;
  recipients: User[];
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
  custom_status?: string;
  status: number;
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
  lastMessaged: number;
  permissions?: ChannelPermissions;
}
interface ChannelPermissions {
  send_message?: boolean
}

function sortServers(servers: ReturnedServer[], positions?: string[]) {
  if (!positions) return servers;
  const tempServers = [...servers];
  const sortServers = [];
  for (let i = 0; i < positions.length; i++) {
    const serverID = positions[i];
    const index = tempServers.findIndex(s => s.server_id === serverID);
    if (index < 0) continue;
    sortServers.push(tempServers[index]);
    tempServers.splice(index, 1);
  }
  return [...sortServers.reverse(), ...tempServers];
}

const actions: ActionTree<any, any> = {
  socket_connect() {
    MeModule.SetConnectionDetails({
      connected: false,
      message: "Authenticating..."
    });
    socket().emit("authentication", {
      token: localStorage.getItem("hauthid")
    });
  },
  socket_authErr(context, data) {
    MeModule.SetConnectionDetails({ connected: false, message: data });
  },
  socket_disconnect() {
    // MeModule.SetConnectionDetails({
    //   connected: false,
    //   message: "Connecting..."
    // });
  },
  socket_reconnecting() {
    MeModule.SetConnectionDetails({
      connected: false,
      message: "Reconnecting..."
    });
  },
  socket_success(context, data: SuccessEvent) {
    MeModule.SetConnectionDetails({ connected: true, message: null });
    MeModule.SetUser({
      email: data.user.email,
      username: data.user.username,
      avatar: data.user.avatar,
      tag: data.user.tag,
      uniqueID: data.user.uniqueID,
      custom_status: data.user.custom_status,
      status: data.user.status
    });

    // set friends
    const users: any = {};
    const friends: any = {};
    for (let i = 0; i < data.user.friends.length; i++) {
      const friend = data.user.friends[i];
      const user = friend.recipient;
      users[user.uniqueID] = user;
      friends[user.uniqueID] = {
        status: friend.status,
        uniqueID: user.uniqueID
      };
    }

    // sort servers by user position.
    const sortedServers = sortServers(
      data.user.servers,
      data.settings.server_position
    );

    // set servers
    const servers: any = {};
    const channels: any = {};

    for (let i = 0; i < sortedServers.length; i++) {
      const server = sortedServers[i];
      servers[server.server_id] = {
        avatar: server.avatar,
        banner: server.banner,
        creator: server.creator,
        default_channel_id: server.default_channel_id,
        name: server.name,
        server_id: server.server_id,
        verified: server.verified,
        channel_position: server.channel_position
      };
      // server channels
      for (let x = 0; x < server.channels.length; x++) {
        const channel = server.channels[x];
        channels[channel.channelID] = {
          channelID: channel.channelID,
          name: channel.name,
          server_id: channel.server_id,
          lastMessaged: channel.lastMessaged,
          permissions: channel.permissions
        };
      }
    }

    // server members
    const serverMembers: any = {};
    for (let i = 0; i < data.serverMembers.length; i++) {
      const serverMember = data.serverMembers[i];

      if (!serverMembers[serverMember.server_id]) {
        serverMembers[serverMember.server_id] = {};
      }
      serverMembers[serverMember.server_id][serverMember.member.uniqueID] = {
        type: serverMember.type,
        uniqueID: serverMember.member.uniqueID,
        server_id: serverMember.server_id,
        roleIdArr: serverMember.roles || []
      };
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

    // dm channel
    for (let i = 0; i < data.dms.length; i++) {
      const channel = data.dms[i];
      if (channel.recipients)
        for (let i = 0; i < channel.recipients.length; i++) {
          const recipient = channel.recipients[i];
          users[recipient.uniqueID] = recipient;
        }
      channels[channel.channelID] = {
        channelID: channel.channelID,
        lastMessaged: channel.lastMessaged,
        recipients: channel.recipients?.map(r => r.uniqueID)
      };
    }

    const notifications: any = {};
    for (let i = 0; i < data.notifications.length; i++) {
      const notification = data.notifications[i];
      notifications[notification.channelID] = notification;
    }

    // muted servers
    const mutedServersObj: any = {};
    for (let i = 0; i < data.mutedServers.length; i++) {
      const obj = data.mutedServers[i];
      mutedServersObj[obj.server_id] = { type: obj.muted };
    }

    MutedServersModule.SetMutedServers(mutedServersObj);
    MutedChannelsModule.SetMutedChannels(data.mutedChannels);
    ServerRolesModule.InitServerRoles(serverRolesObj);
    PresencesModule.InitPresences(presenceObj);
    ServerMembersModule.InitServerMembers(serverMembers);
    UsersModule.InitUsers(users);
    FriendsModule.InitFriends(friends);
    ServersModule.InitServers(servers);
    LastSeenServerChannelsModule.InitLastSeen(data.lastSeenServerChannels);
    NotificationsModule.InitNotifications(notifications);
    ChannelsModule.InitChannels(channels);
    CustomEmojisModule.InitCustomEmojis(data.settings.customEmojis);
  }
};

export default {
  actions
};
