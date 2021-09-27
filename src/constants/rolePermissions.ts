import i18n from "@/i18n";

// Has to be get-methods because otherwise doesn't load properly
// Maybe fix differently?
export const permissions = {
  ADMIN: {
    get name() {
      return i18n.global.t("server-settings.permissions.admin.name");
    },
    value: 1,
    get info() {
      return i18n.global.t("server-settings.permissions.admin.info");
    },
  },
  SEND_MESSAGES: {
    get name() {
      return i18n.global.t("server-settings.permissions.send-messages.name");
    },
    value: 2,
    get info() {
      return i18n.global.t("server-settings.permissions.send-messages.info");
    },
  },
  MANAGE_ROLES: {
    get name() {
      return i18n.global.t("server-settings.permissions.manage-roles.name");
    },
    value: 4,
    get info() {
      return i18n.global.t("server-settings.permissions.manage-roles.info");
    },
  },
  MANAGE_CHANNELS: {
    get name() {
      return i18n.global.t("server-settings.permissions.manage-channels.name");
    },
    value: 8,
    get info() {
      return i18n.global.t("server-settings.permissions.manage-channels.info");
    },
  },
  KICK_USER: {
    get name() {
      return i18n.global.t("server-settings.permissions.kick-user.name");
    },
    value: 16,
    get info() {
      return i18n.global.t("server-settings.permissions.kick-user.info");
    },
  },
  BAN_USER: {
    get name() {
      return i18n.global.t("server-settings.permissions.ban-user.name");
    },
    value: 32,
    get info() {
      return i18n.global.t("server-settings.permissions.ban-user.info");
    },
  },
};
