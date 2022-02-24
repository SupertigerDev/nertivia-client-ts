import Channel from "@/interfaces/Channel";
import router from "@/router";
import { ChannelsModule } from "@/store/modules/channels";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { programActivitiesModule } from "@/store/modules/memberProgramActivity";
import { MessagesModule } from "@/store/modules/messages";
import { MutedServersModule } from "@/store/modules/mutedServers";
import { PresencesModule } from "@/store/modules/presences";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import { ServersModule } from "@/store/modules/servers";
import { UsersModule } from "@/store/modules/users";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { Socket } from "socket.io-client";

export const onPositionChanged = (data: { server_position: string[] }) => {
  ServersModule.SetServerPositions(data.server_position);
};

interface ServerMemberAddOrRemoveRole {
  role_id: string;
  server_id: string;
  id: string;
}

export const onMemberRoleAdded = (data: ServerMemberAddOrRemoveRole) => {
  ServerMembersModule.AddMemberRole({
    serverID: data.server_id,
    id: data.id,
    roleID: data.role_id,
  });
};
export const onMemberRoleRemoved = (data: ServerMemberAddOrRemoveRole) => {
  ServerMembersModule.RemoveMemberRole({
    serverID: data.server_id,
    id: data.id,
    roleID: data.role_id,
  });
};
export const onJoined = (socket: Socket, data: any) => {
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
    server_id: data.server_id,
  });

  const channelObj: any = {};
  for (let x = 0; x < channels.length; x++) {
    const channel = channels[x];
    channelObj[channel.channelId] = {
      channelId: channel.channelId,
      name: channel.name,
      categoryId: channel.categoryId,
      type: channel.type,
      server_id: channel.server_id,
      lastMessaged: channel.lastMessaged,
      permissions: channel.permissions,
      rateLimit: channel.rateLimit,
      icon: channel.icon,
    };
  }
  ChannelsModule.AddChannels(channelObj);
  if (socket.id === socketID) {
    router.push(`/app/servers/${data.server_id}/${data.default_channel_id}`);
  }
};

export const onLeave = (data: { server_id: string }) => {
  ServersModule.DeleteServer(data.server_id);
  MessagesModule.DeleteServerMessages(data.server_id);
  voiceChannelModule.deleteServerVoiceChannels(data.server_id);
  ChannelsModule.DeleteAllServerChannels(data.server_id);
  ServerRolesModule.DeleteAllServerRoles(data.server_id);
  ServerMembersModule.RemoveAllServerMembers(data.server_id);

  if (router.currentRoute.value.params?.server_id === data.server_id) {
    router.push("/app");
  }
};
export const onRolesUpdate = ({ roles, server_id }) => {
  const serverRolesObj: any = {};
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    serverRolesObj[role.id] = role;
  }
  ServerRolesModule.AddServerRoles({
    roles: serverRolesObj,
    serverID: server_id,
  });
};
export const onRoleCreated = (role) => {
  ServerRolesModule.AddServerRole(role);
};
export const onRoleUpdated = (partialRole) => {
  ServerRolesModule.UpdateServerRole(partialRole);
};
export const onRoleRemoved = ({ role_id, server_id }) => {
  ServerRolesModule.DeleteServerRole({ role_id, server_id });
};
export const onMute = (data: { muted: number; server_id: string }) => {
  MutedServersModule.SetMutedServer({
    serverID: data.server_id,
    type: data.muted,
  });
};

export const onMemberRemove = ({ id, server_id }) => {
  voiceChannelModule.removeServerUser({ userId: id, serverId: server_id });
  ServerMembersModule.RemoveServerMember({ id, server_id });
};

// get all roles after joining the server
export const onRoles = ({ roles, server_id }) => {
  const serverRolesObj: any = {};
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    serverRolesObj[role.id] = role;
  }
  ServerRolesModule.AddServerRoles({
    roles: serverRolesObj,
    serverID: server_id,
  });
};

function filterServerMemberKeys(serverMember: any) {
  return {
    type: serverMember.type,
    id: serverMember.member.id,
    server_id: serverMember.server_id,
    roleIdArr: serverMember.roles || [],
  };
}
export const onMemberAdd = ({ serverMember, presence, custom_status }) => {
  UsersModule.AddUser(serverMember.member);
  PresencesModule.UpdatePresence({
    id: serverMember.member.id,
    presence: presence,
  });
  CustomStatusesModule.SetCustomStatus({
    id: serverMember.member.id,
    custom_status: custom_status,
  });
  ServerMembersModule.AddServerMember(filterServerMemberKeys(serverMember));
};

// get all members after joining the server
export const onMembers = ({
  serverMembers,
  memberPresences,
  memberCustomStatusArr,
  programActivityArr,
  callingChannelUserIds,
}) => {
  const serverMembersObj: any = {};
  const usersObj: any = {};
  const presenceObj: any = {};
  const customStatusObj: any = {};
  const activity: any = {};
  const calls: any = {};
  for (let i = 0; i < serverMembers.length; i++) {
    const serverMember = serverMembers[i];

    if (!serverMembersObj[serverMember.server_id]) {
      serverMembersObj[serverMember.server_id] = {};
    }
    serverMembersObj[serverMember.server_id][serverMember.member.id] =
      filterServerMemberKeys(serverMember);
    usersObj[serverMember.member.id] = serverMember.member;
  }
  for (let i = 0; i < memberPresences.length; i++) {
    const [id, presence] = memberPresences[i];
    presenceObj[id] = parseInt(presence);
  }
  for (let i = 0; i < memberCustomStatusArr.length; i++) {
    const [id, custom_status] = memberCustomStatusArr[i];
    customStatusObj[id] = custom_status;
  }
  for (let i = 0; i < programActivityArr.length; i++) {
    const { name, status, user_id } = programActivityArr[i];
    activity[user_id] = { name, status };
  }
  for (const channelId in callingChannelUserIds) {
    const userIds = callingChannelUserIds[channelId];
    calls[channelId] = {};
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      calls[channelId][userId] = {};
    }
  }
  programActivitiesModule.AddActivities(activity);
  PresencesModule.AddPresences(presenceObj);
  CustomStatusesModule.AddCustomStatuses(customStatusObj);
  UsersModule.AddUsers(usersObj);
  ServerMembersModule.AddServerMembers(serverMembersObj);
  voiceChannelModule.AddVoiceChannels(calls);
};
