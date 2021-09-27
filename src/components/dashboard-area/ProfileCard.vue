<template>
  <div class="card">
    <div class="title" v-if="!hideTitle">
      {{ $t("dashboard-tab.profile") }}
    </div>
    <div class="content">
      <avatar-image
        class="avatar"
        :imageId="me.avatar"
        :seedId="me.id"
        size="80px"
        :animateGif="false"
      />
      <div class="info">
        <span class="username">{{ me.username }}</span
        ><span class="tag">:{{ me.tag }}</span>
      </div>
      <div
        class="custom-status"
        v-if="connected"
        @click="customStatusClick"
        v-click-outside="clickOutside"
      >
        <Markup
          :largeEmoji="false"
          v-if="!editCustomStatus && customStatus"
          :text="customStatus"
        />
        <input
          ref="input"
          @keydown="keyDownEvent"
          v-if="editCustomStatus"
          type="text"
          v-model="customStatusText"
        />
        <div class="placeholder" v-if="!customStatus && !editCustomStatus">
          {{ $t("dashboard-tab.click-to-add-custom-status") }}
        </div>
      </div>
      <div class="online-status" ref="currentStatus" @click="openStatusContext">
        <div class="dot" :style="{ background: statusColor }" />
        <div class="name">{{ statusName }}</div>
      </div>
      <div class="material-icons logout-icon" title="Logout" @click="logOut">
        exit_to_app
      </div>
      <div class="material-icons settings-icon" @click="settingsClicked">
        settings
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { MeModule } from "@/store/modules/me";
import userStatuses from "@/constants/userStatuses";
import { PopoutsModule } from "@/store/modules/popouts";
import { changeCustomStatus, logout } from "@/services/userService";
import Markup from "@/components/Markup";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileCard",
  components: { AvatarImage, Markup },
  props: {
    identity: {
      type: String,
      required: false,
    },
    hideTitle: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      editCustomStatus: false,
      customStatusText: "",
    };
  },
  computed: {
    connected(): any {
      return MeModule.connected;
    },
    connectionMessage(): any {
      return MeModule.connectionMessage;
    },
    me(): any {
      return MeModule.user;
    },
    customStatus(): any {
      if (!this.me?.id) return undefined;
      return CustomStatusesModule.customStatus[this.me.id];
    },
    statusColor(): any {
      if (!this.connected) return userStatuses[0].color;
      return userStatuses[this.me.status].color;
    },
    statusName(): any {
      if (!this.connected) return this.connectionMessage;
      const name = userStatuses[this.me.status].name;
      return name === "Offline" ? "Invisible" : name;
    },
  },
  methods: {
    settingsClicked() {
      this.$router.push("/app/settings/account");
      if (this.identity) {
        PopoutsModule.ClosePopout(this.identity);
      }
    },
    customStatusClick() {
      if (this.editCustomStatus) return;
      if (this.customStatus) {
        this.customStatusText = this.customStatus;
      }
      this.editCustomStatus = true;
      this.$nextTick(() => (this.$refs.input as HTMLElement).focus());
    },
    keyDownEvent(event: KeyboardEvent) {
      if (event.key === "Escape") {
        this.editCustomStatus = false;
        return;
      }
      if (event.key === "Enter") {
        this.changeStatus(this.customStatusText);
        this.editCustomStatus = false;
        return;
      }
    },
    clickOutside() {
      if (!this.editCustomStatus) return;
      this.changeStatus(this.customStatusText);
      this.editCustomStatus = false;
    },
    changeStatus(status: string) {
      changeCustomStatus(status).catch(async (err) => {
        if (!err.response) {
          PopoutsModule.ShowPopout({
            id: "custom-status-update-error",
            component: "generic-popout",
            data: {
              title: "Oops!",
              description: this.$t("could-not-connect-to-server"),
            },
          });
          return;
        }
        const json = await err.response.json();
        PopoutsModule.ShowPopout({
          id: "custom-status-update-error",
          component: "generic-popout",
          data: {
            title: "Oops!",
            description: json,
          },
        });
      });
    },
    logOut() {
      logout().finally(() => {
        localStorage.clear();
        location.href = "/";
      });
    },
    openStatusContext() {
      const el = this.$refs.currentStatus as HTMLElement;
      const rect = el.getBoundingClientRect();
      const contextWidth = 148;
      const rectWidth = rect.width;
      PopoutsModule.ShowPopout({
        id: "context",
        data: {
          x: rect.left + rectWidth / 2 - contextWidth / 2,
          y: rect.top + rect.height + 10,
        },
        component: "StatusListContext",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.content .title {
  margin: 10px;
  margin-left: 5px;
  font-size: 20px;
  position: absolute;
}
.card {
  display: flex;
  flex-direction: row;
  border: solid 1px rgba(255, 255, 255, 0.1);
  position: relative;
  margin: 10px;
  margin-top: 10px;
  background: var(--card-color);
  padding: 5px;
  display: flex;
  height: 300px;
  width: 250px;
  border-radius: 4px;
  overflow: hidden;
  .item-title {
    opacity: 0.8;
    margin-left: 5px;
    user-select: none;
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  margin: auto;
  overflow: hidden;
}
.avatar {
  align-self: center;
}
.info {
  margin-top: 15px;
  align-self: center;
  .tag {
    opacity: 0.8;
  }
}
.custom-status {
  white-space: nowrap;
  overflow: hidden;
  max-width: 95%;
  text-overflow: ellipsis;
  align-self: center;
  margin-top: 5px;
  padding: 3px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  opacity: 0.7;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    opacity: 1;
  }
  input {
    background: transparent;
    color: white;
    border: none;
    outline: none;
    text-align: center;
  }
  .placeholder {
    font-size: 14px;
  }
}
.online-status {
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.3);
  align-self: center;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 10px;
  height: 20px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  .dot {
    margin-right: 5px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
  .name {
    margin-top: 1px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
.settings-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
  }
}
.logout-icon {
  position: absolute;
  bottom: 10px;
  left: 10px;
  opacity: 0.7;
  transition: 0.2s;
  color: var(--alert-color);
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
  }
}
</style>
