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
import { MutedServersModule } from "../mutedServers";
import CustomEmoji from "@/interfaces/CustomEmoji";
import { CustomEmojisModule } from "../customEmojis";
import { CustomStatusesModule } from "../memberCustomStatus";
import { programActivitiesModule } from "../memberProgramActivity";
import SocketIO from "socket.io-client";

import {
  CONNECT,
  AUTH_ERROR,
  SUCCESS,
  DISCONNECT,
  RECONNECTING
} from "@/socketEventConstants";
import i18n from "@/i18n";

const socket = (() => Vue.prototype.$socket.client) as typeof SocketIO;

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
  customStatusArr: [string, string][];
  programActivityArr: ReturnedProgramActivity[];
  bannedUserIDs: string[];
}
interface Settings {
  server_position: string[];
  customEmojis: CustomEmoji[];
  GDriveLinked?: boolean;
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

interface ReturnedProgramActivity {
  name: string;
  status: string;
  user_id: string;
}
interface ReturnedDmChannel {
  lastMessaged: number;
  channelID: string;
  recipients: User[];
}

interface MeUser {
  username: string;
  id: string;
  email: string;
  tag: string;
  admin: number;
  avatar?: string | null;
  banner?: string | null;
  friends: Friend[];
  servers: ReturnedServer[];
  type?: string;
  custom_status?: string;
  status: number;
  badges?: number;
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
    id: string;
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
  icon?: string | null;
  lastMessaged: number;
  permissions?: ChannelPermissions;
  rateLimit?: number;
}
interface ChannelPermissions {
  send_message?: boolean;
}

const actions: ActionTree<any, any> = {
  [CONNECT]() {
    MeModule.SetConnectionDetails({
      connected: false,
      message: i18n.t("connection.authenticating").toString()
    });
    socket().emit("authentication", {
      token: localStorage.getItem("hauthid")
    });
  },
  [AUTH_ERROR](context, data) {
    MeModule.SetConnectionDetails({ connected: false, message: data });
  },
  [DISCONNECT]() {
    // MeModule.SetConnectionDetails({
    //   connected: false,
    //   message: "Connecting..."
    // });
  },
  [RECONNECTING]() {
    MeModule.SetConnectionDetails({
      connected: false,
      message: "Reconnecting..."
    });
  },
  [SUCCESS](context, data: SuccessEvent) {
    MeModule.SetConnectionDetails({ connected: true, message: null });
    MeModule.SetUser({
      email: data.user.email,
      username: data.user.username,
      avatar: data.user.avatar,
      banner: data.user.banner,
      tag: data.user.tag,
      id: data.user.id,
      type: data.user.type,
      badges: data.user.badges,
      status: data.user.status,
      googleDriveLinked: data.settings.GDriveLinked
    });

    // set friends
    const users: any = {};
    const friends: any = {};
    for (let i = 0; i < data.user.friends.length; i++) {
      const friend = data.user.friends[i];
      const user = friend.recipient;
      users[user.id] = user;
      friends[user.id] = {
        status: friend.status,
        id: user.id
      };
    }

    // set servers
    const servers: any = {};
    const channels: any = {};

    // dm channel
    for (let i = 0; i < data.dms.length; i++) {
      const channel = data.dms[i];
      if (channel.recipients)
        for (let i = 0; i < channel.recipients.length; i++) {
          const recipient = channel.recipients[i];
          users[recipient.id] = recipient;
        }
      channels[channel.channelID] = {
        channelID: channel.channelID,
        lastMessaged: channel.lastMessaged,
        recipients: channel.recipients?.map(r => r.id)
      };
    }
    for (let i = 0; i < data.user.servers.length; i++) {
      const server = data.user.servers[i];
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
          permissions: channel.permissions,
          icon: channel.icon,
          rateLimit: channel.rateLimit || 0
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
      serverMembers[serverMember.server_id][serverMember.member.id] = {
        type: serverMember.type,
        id: serverMember.member.id,
        server_id: serverMember.server_id,
        roleIdArr: serverMember.roles || []
      };
      users[serverMember.member.id] = serverMember.member;
    }

    const presenceObj: any = {};
    for (let i = 0; i < data.memberStatusArr.length; i++) {
      const id = data.memberStatusArr[i][0];
      const status = data.memberStatusArr[i][1];
      presenceObj[id] = parseInt(status);
    }

    const serverRolesObj: any = {};
    for (let i = 0; i < data.serverRoles.length; i++) {
      const role = data.serverRoles[i];
      if (serverRolesObj[role.server_id]) {
        serverRolesObj[role.server_id][role.id] = role;
        continue;
      }
      serverRolesObj[role.server_id] = { [role.id]: role };
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

    // custom status
    const customStatusObj: any = {};
    for (let i = 0; i < data.customStatusArr.length; i++) {
      const element = data.customStatusArr[i];
      customStatusObj[element[0]] = element[1];
    }
    // programActivity
    const programActivityObj: any = {};
    for (let i = 0; i < data.programActivityArr.length; i++) {
      const programActivity = data.programActivityArr[i];
      programActivityObj[programActivity.user_id] = {
        status: programActivity.status,
        name: programActivity.name
      };
    }
    UsersModule.InitBlockedUsers(data.bannedUserIDs);
    ServersModule.SetServerPositions(data.settings.server_position || []);
    programActivitiesModule.InitProgramActivity(programActivityObj);
    CustomStatusesModule.InitCustomStatus(customStatusObj);
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
