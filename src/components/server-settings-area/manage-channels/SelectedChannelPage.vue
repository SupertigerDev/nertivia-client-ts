<template>
  <div class="container selected-channel-page" v-if="channel">
    <div
      class="notice warn"
      v-if="channel.channelId === server.default_channel_id"
    >
      {{ $t("server-settings.manage-channels.default-channel-notice") }}
    </div>
    <div class="grouped">
      <div class="emoji-button" @click="showIconContext = !showIconContext">
        <div v-if="channelIcon === null && channel.type === 2" class="material-icons">segment</div>
        <div v-else-if="channelIcon === null && channel.type === 1" class="dot"></div>
        <div v-else v-html="channelIconHTML" />
      </div>
      <ContextMenu
        v-if="showIconContext"
        :items="[
          { id: 'emoji', name: 'Emoji', icon: 'face' },
          { id: 'default', name: 'Default', icon: 'circle', iconSize: '10px' },
        ]"
        @itemClick="onEmojiContextClick"
        :pos="{ x: 0, y: 60 }"
      />
      <PickerArea
        style="top: 60px; left: 0px; height: 500px"
        @click="emojiClicked"
        :hideTabs="true"
        v-if="showEmojiPicker"
      />

      <CustomInput
        class="input"
        :title="$t('server-settings.manage-channels.channel-name')"
        :error="error"
        v-model="channelName"
      />
    </div>
    <!-- TODO: replace with bitwise permissions some day (just like how i made role permissions) -->
    <!-- TODO: Per user channel permission pls -->
    <div class="title">
      {{ $t("server-settings.permissions.permissions") }}
    </div>
    <CheckBox
      :name="$t('server-settings.manage-channels.permission.send-message')"
      v-model="sendMessagePermission"
      :colored="true"
    />
    <CustomInput
      class="input slow"
      :title="$t('server-settings.manage-channels.rate-limit-seconds')"
      v-model="rateLimit"
      prefixIcon="query_builder"
    />
    <CustomButton
      class="button"
      :filled="true"
      :name="!requestSent ? $t('save-changes') : $t('saving')"
      icon="save"
      v-if="showSaveButton"
      @click="update"
    />
    <CustomButton
      class="button delete-button"
      :filled="true"
      :name="
        !deleteConfirm
          ? $t('server-settings.manage-channels.delete-channel')
          : deleteRequestSent
          ? $t('server-settings.manage-channels.deleting-channel')
          : $t('are-you-sure')
      "
      :alert="true"
      icon="delete"
      v-if="channel.channelId !== server.default_channel_id"
      @click="deleteChannel"
    />
    <CustomButton
      class="button back-button"
      :name="$t('back')"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import CheckBox from "@/components/CheckBox.vue";
import PickerArea from "@/components/picker-area/PickerArea.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import {
  deleteServerChannel,
  updateServerChannel,
} from "@/services/channelService";
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
import Channel from "@/interfaces/Channel";
import twemoji from "twemoji";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageChannels",
  components: {
    CustomInput,
    CustomButton,
    CheckBox,
    ContextMenu,
    PickerArea,
  },
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      deleteConfirm: false,
      deleteRequestSent: false,
      requestSent: false,
      channelName: "" as string | undefined,
      channelIcon: null as null | string,
      rateLimit: 0,
      error: null as string | null,
      showIconContext: false,
      showEmojiPicker: false,
      sendMessagePermission: false,
    };
  },
  computed: {
    channelIconHTML(): any {
      if (!this.channelIcon) return null;
      const isCustom =
        this.channelIcon?.startsWith("g_") ||
        this.channelIcon?.startsWith("c_");
      const isGif = this.channelIcon?.startsWith("g_");
      const customEmojiID = this.channelIcon?.split("_")[1];

      const image = new Image();
      image.classList.add("emoji");

      if (isCustom) {
        image.src = `${
          process.env.VUE_APP_NERTIVIA_CDN
        }emojis/${customEmojiID}.${isGif ? "gif" : "png"}`;
      } else {
        image.src =
          process.env.VUE_APP_TWEMOJI_LOCATION +
          twemoji.convert.toCodePoint(this.channelIcon).replace("-fe0f", "") +
          ".svg";
      }
      return image.outerHTML;
    },
    channel(): Channel | undefined {
      return ChannelsModule.channels[this.channelId];
    },
    server(): any {
      return ServersModule.servers[this.channel?.server_id || ""];
    },
    showSaveButton(): any {
      const { channelName, sendMessagePermission, rateLimit, channelIcon } =
        this.changed;
      return channelName || sendMessagePermission || rateLimit || channelIcon;
    },
    changed(): any {
      let currentPermission = this.channel?.permissions?.send_message;
      if (this.channel?.permissions?.send_message === undefined) {
        currentPermission = true;
      }
      const rateLimit = this.rateLimit !== (this.channel?.rateLimit || 0);
      const channelName = this.channelName !== this.channel?.name;

      const channelIcon = (this.channel?.icon || null) !== this.channelIcon;

      const sendMessagePermission =
        this.sendMessagePermission !== currentPermission || false;

      return { channelName, sendMessagePermission, rateLimit, channelIcon };
    },
    connected(): any {
      return MeModule.connected;
    },
  },
  watch: {
    connected: {
      handler: "isConnected",
    },
    channel: {
      handler: "channelChange",
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      this.rateLimit = this.channel?.rateLimit || 0;
      this.channelName = this.channel?.name;
      this.channelIcon = this.channel?.icon || null;
      if (this.channel?.permissions?.send_message === undefined) {
        return (this.sendMessagePermission = true);
      }
      this.sendMessagePermission =
        this.channel?.permissions?.send_message || false;
    },
    onEmojiContextClick(item: { id: string }) {
      switch (item.id) {
        case "emoji":
          this.showEmojiPicker = true;
          this.showIconContext = false;
          break;
        case "default":
          this.channelIcon = null;
          this.showIconContext = false;
          break;
        default:
          break;
      }
    },
    emojiClicked(emoji: any) {
      const { unicode, id, gif } = emoji;
      this.showEmojiPicker = false;
      if (unicode) {
        this.channelIcon = unicode;
        return;
      }
      this.channelIcon = `${gif ? "g" : "c"}_${id}`;
    },
    isConnected(val: boolean) {
      if (val) {
        this.reset();
      }
    },
    channelChange(channel: Channel) {
      if (!channel) {
        this.$emit("close");
      }
    },
    deleteChannel() {
      if (!this.channel?.server_id) return;
      if (this.deleteRequestSent) return;
      if (!this.deleteConfirm) {
        this.deleteConfirm = true;
        return;
      }
      this.deleteRequestSent = true;

      deleteServerChannel(this.channelId, this.channel.server_id)
        .then(() => {
          this.$emit("close");
          ChannelsModule.RemoveChannel(this.channelId);
        })
        .finally(() => {
          this.deleteRequestSent = false;
          this.deleteConfirm = false;
        });
    },
    update() {
      if (this.requestSent) return;
      this.requestSent = true;
      if (!this.channel?.server_id) return;
      this.error = null;
      updateServerChannel(this.channel.channelId, this.channel.server_id, {
        name: this.channelName,
        permissions: { send_message: this.sendMessagePermission },
        rateLimit: parseInt(this.rateLimit as any),
        icon: this.channelIcon || null,
      })
        .then((json) => {
          ChannelsModule.updateChannel({
            channelId: json.channelId,
            update: json,
          });
          this.reset();
        })
        .catch(async (err) => {
          if (!err.response) {
            return (this.error = this.$t(
              "could-not-connect-to-server"
            ).toString());
          }
          const json = await err.response.json();
          const { errors, message } = json;
          if (message) return (this.error = message);
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            this.error = error.msg;
          }
        })
        .finally(() => (this.requestSent = false));
    },
  },
});
</script>

<style lang="scss" scoped>
.emoji-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  height: 25px;
  width: 25px;
  margin-top: 7px;
  margin-right: 5px;
  flex-shrink: 0;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  cursor: pointer;
  .dot {
    background: white;
    height: 6px;
    width: 6px;
    border-radius: 50%;
  }
}

.container.selected-channel-page {
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: flex-start;
  overflow: auto;
}
.input {
  margin-left: -2px;
  &.slow {
    width: 190px;
    margin-top: 10px;
  }
}
.button {
  margin-top: 10px;
  margin-left: 0;
}
.grouped {
  position: relative;
  display: flex;
}
.delete-button {
  margin-top: 50px;
}
.back-button {
  margin: auto;
  margin-left: 0px;
  margin-bottom: 0;
}
.title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}
.notice.warn {
  border: solid 1px var(--warn-color);
  padding: 5px;
  border-radius: 4px;
  max-width: 600px;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>

<style>
.emoji-button div {
  height: 25px;
  width: 25px;
}
.emoji-button .emoji {
  height: 25px;
  width: 25px;
}
</style>
