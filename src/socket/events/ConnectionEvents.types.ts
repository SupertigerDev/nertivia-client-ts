import CustomEmoji from "@/interfaces/CustomEmoji";
import ServerRole from "@/interfaces/ServerRole";
import User from "@/interfaces/User";
export interface SuccessEvent {
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
  callingChannelUserIds: { [key: string]: Array<string> };
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
  show_welcome?: boolean;
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
