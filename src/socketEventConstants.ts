function eventBuilder(name: string, prefix = "socket_") {
  return prefix + toCamel(name);
}

function toCamel(s: string) {
  return s.replace(/([_][a-z])/gi, $1 => {
    // return s.replace(/([-_][a-z])/ig, ($1) => {
    return (
      $1
        .toUpperCase()
        // .replace('-', '')
        .replace("_", "")
    );
  });
}
// connection events
export const CONNECT = eventBuilder("connect");
export const DISCONNECT = eventBuilder("disconnect");
export const RECONNECTING = eventBuilder("reconnecting");
export const SUCCESS = eventBuilder("success");
export const AUTH_ERROR = eventBuilder("auth_err");
// message events
export const RECEIVE_MESSAGE = eventBuilder("receive_message");
export const DELETE_MESSAGE = eventBuilder("delete_message");
export const UPDATE_MESSAGE = eventBuilder("update_message");
// notification events
export const NOTIFICATION_DISMISS = eventBuilder("notification:dismiss");
// channel events
export const CHANNEL_CREATED = eventBuilder("channel:created");
export const CHANNEL_REMOVED = eventBuilder("channel:remove");
export const CHANNEL_UNMUTE = eventBuilder("channel:unmute");
export const CHANNEL_MUTE = eventBuilder("channel:mute");
// server channel events
export const SERVER_CHANNEL_CREATED = eventBuilder("server:add_channel");
export const SERVER_CHANNEL_REMOVED = eventBuilder("server:remove_channel");
export const SERVER_CHANNEL_UPDATE = eventBuilder("server:update_channel");
export const SERVER_CHANNEL_POSITION_CHANGE = eventBuilder(
  "server:channel_position"
);
// server events
export const SERVER_POSITION = eventBuilder("self:server_position");
export const SERVER_ADD_ROLE = eventBuilder("serverMember:add_role");
export const SERVER_JOINED = eventBuilder("server:joined");
export const SERVER_LEAVE = eventBuilder("server:leave");
export const SERVER_MEMBERS = eventBuilder("server:members");
export const SERVER_MEMBER_ADD = eventBuilder("server:member_add");
export const SERVER_MEMBER_REMOVE = eventBuilder("server:member_remove");
export const SERVER_ROLES = eventBuilder("server:roles");
export const SERVER_UPDATE_ROLES = eventBuilder("server:update_roles");
export const SERVER_CREATE_ROLE = eventBuilder("server:create_role");
export const SERVER_UPDATE_ROLE = eventBuilder("server:update_role");
export const SERVER_REMOVE_ROLE = eventBuilder("server:delete_role");
export const SERVER_MEMBER_REMOVE_ROLE = eventBuilder(
  "serverMember:remove_role"
);
export const SERVER_MUTE = eventBuilder("server:mute");
// user events
export const SELF_STATUS_CHANGE = eventBuilder("multi_device_status");
export const SELF_CUSTOM_STATUS_CHANGE = eventBuilder(
  "multi_device_custom_status"
);
export const USER_STATUS_CHANGE = eventBuilder("user_status_change");
export const CUSTOM_STATUS_CHANGE = eventBuilder("member:custom_status_change");
// relationship events
export const RELATIONSHIP_ADD = eventBuilder("relationship_add");
export const RELATIONSHIP_REMOVE = eventBuilder("relationship_remove");
export const RELATIONSHIP_ACCEPT = eventBuilder("relationship_accept");
// custom emoji events
export const CUSTOM_EMOJI_RENAME = eventBuilder("customEmoji:rename");
export const CUSTOM_EMOJI_UPLOADED = eventBuilder("customEmoji:uploaded");
export const CUSTOM_EMOJI_REMOVE = eventBuilder("customEmoji:remove");
// program activity events
export const PROGRAM_ACTIVITY_CHANGED = eventBuilder("programActivity:changed");
