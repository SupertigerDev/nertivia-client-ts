// connection events
export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const RECONNECT_ATTEMPT = "reconnect_attempt";
export const SUCCESS = "success";
export const AUTH_ERROR = "auth_err";
// message events
export const RECEIVE_MESSAGE = "receiveMessage";
export const DELETE_MESSAGE = "delete_message";
export const UPDATE_MESSAGE = "update_message";
// message reaction events
export const UPDATE_MESSAGE_REACTION = "message:update_reaction";
// notification events
export const NOTIFICATION_DISMISS = "notification:dismiss";
// channel events
export const CHANNEL_CREATED = "channel:created";
export const CHANNEL_REMOVED = "channel:remove";
export const CHANNEL_UNMUTE = "channel:unmute";
export const CHANNEL_MUTE = "channel:mute";
// server channel events
export const SERVER_CHANNEL_CREATED = "server:add_channel";
export const SERVER_CHANNEL_REMOVED = "server:remove_channel";
export const SERVER_CHANNEL_UPDATE = "server:update_channel";
export const SERVER_CHANNEL_POSITION_CHANGE = "server:channel_position";
// server events
export const SERVER_POSITION = "self:server_position";
export const SERVER_JOINED = "server:joined";
export const SERVER_LEAVE = "server:leave";
export const SERVER_MEMBER_REMOVE = "server:member_remove";
export const SERVER_MEMBERS = "server:members";
export const SERVER_MEMBER_ADD = "server:member_add";
export const SERVER_ROLES = "server:roles";
export const SERVER_UPDATE_ROLES = "server:update_roles";
export const SERVER_CREATE_ROLE = "server:create_role";
export const SERVER_UPDATE_ROLE = "server:update_role";
export const SERVER_REMOVE_ROLE = "server:delete_role";
export const SERVER_MEMBER_ADD_ROLE = "server_member:add_role";
export const SERVER_MEMBER_REMOVE_ROLE = "server_member:remove_role";
export const SERVER_MUTE = "server:mute";
// user events
export const SELF_STATUS_CHANGE = "multiDeviceStatus";
export const USER_BLOCKED = "user:block";
export const USER_UNBLOCKED = "user:unblock";
export const SELF_CUSTOM_STATUS_CHANGE = "multiDeviceCustomStatus";
// call events
export const USER_JOINED_CALL = "user:joined_call";
export const USER_LEFT_CALL = "user:left_call";
export const VOICE_RECEIVE_SIGNAL = "voice:receive_signal";
export const VOICE_RECEIVE_RETURN_SIGNAL = "voice:receive_return_signal";

export const GOOGLE_DRIVE_LINKED = "googleDrive:linked";
export const USER_STATUS_CHANGE = "userStatusChange";
export const CUSTOM_STATUS_CHANGE = "member:custom_status_change";
// relationship events
export const RELATIONSHIP_ADD = "relationshipAdd";
export const RELATIONSHIP_REMOVE = "relationshipRemove";
export const RELATIONSHIP_ACCEPT = "relationshipAccept";
// custom emoji events
export const CUSTOM_EMOJI_RENAME = "customEmoji:rename";
export const CUSTOM_EMOJI_UPLOADED = "customEmoji:uploaded";
export const CUSTOM_EMOJI_REMOVE = "customEmoji:remove";
// program activity events
export const PROGRAM_ACTIVITY_CHANGED = "programActivity:changed";
