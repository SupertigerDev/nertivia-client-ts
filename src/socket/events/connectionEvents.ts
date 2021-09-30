import { ChannelsModule } from "@/store/modules/channels";
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import { FriendsModule } from "@/store/modules/friends";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MeModule } from "@/store/modules/me";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { programActivitiesModule } from "@/store/modules/memberProgramActivity";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { MutedServersModule } from "@/store/modules/mutedServers";
import { NotificationsModule } from "@/store/modules/notifications";
import { PopoutsModule } from "@/store/modules/popouts";
import { PresencesModule } from "@/store/modules/presences";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { ServersModule } from "@/store/modules/servers";
import { UsersModule } from "@/store/modules/users";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { Socket } from "socket.io-client";
import { SuccessEvent } from "./ConnectionEvents.types";

export const onConnect = (socket: Socket) => {
  socket.emit("authentication", {
    token: localStorage.getItem("hauthid"),
  });
};

export const onReconnectAttempt = (socket: Socket) => {
  MeModule.SetConnectionDetails({
    connected: false,
    message: "Reconnecting...",
  });
};
export const onSuccess = (socket: Socket, data: SuccessEvent) => {
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
    googleDriveLinked: data.settings.GDriveLinked,
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
      id: user.id,
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
      recipients: channel.recipients?.map((r) => r.id),
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
      channel_position: server.channel_position,
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
        rateLimit: channel.rateLimit || 0,
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
      roleIdArr: serverMember.roles || [],
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

  // current calls
  const calls = {};
  for (const channelId in data.callingChannelUserIds) {
    const userIds = data.callingChannelUserIds[channelId];
    calls[channelId] = {};
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      calls[channelId][userId] = {};
    }
  }
  voiceChannelModule.InitVoiceChannels(calls);

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
      name: programActivity.name,
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

  if (data.user.show_welcome) {
    PopoutsModule.ShowPopout({
      id: "welcome",
      component: "Welcome",
      data: {},
    });
  }
};

export const onAuthError = (socket: Socket, reason: string) => {
  MeModule.SetConnectionDetails({ connected: false, message: reason });
};
