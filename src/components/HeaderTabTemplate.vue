<template>
  <router-link
    class="tab"
    :title="tab.name"
    :class="{ selected, opened: tab.opened }"
    :to="tab.path"
    ref="tab"
    @dblclick="openTab"
    @contextmenu="onRightClick"
  >
    <div class="icon material-icons" v-if="tab.icon || isSavedNotes">
      {{ isSavedNotes ? "book" : tab.icon }}
    </div>
    <AvatarImage
      v-if="seed && !isSavedNotes"
      size="20px"
      :imageId="avatar"
      :seedId="seed"
    />
    <UserStatusTemplate
      class="status"
      v-if="user && !isSavedNotes"
      :id="user.id"
      :showOffline="true"
    />
    <div class="outer-title" :class="{ showAlert }">
      <div class="title">{{ title }}</div>
    </div>
    <div class="close-button material-icons" @click.prevent="closeTab">
      close
    </div>
  </router-link>
</template>

<script lang="ts">
import { Tab, TabsModule } from "@/store/modules/tabs";
import { PropType } from "vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { UsersModule } from "@/store/modules/users";
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import Server from "@/interfaces/Server";
import User from "@/interfaces/User";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";

import { defineComponent } from "vue";
import { PopoutsModule } from "@/store/modules/popouts";
export default defineComponent({
  components: { AvatarImage, UserStatusTemplate },
  props: {
    selected: Boolean,
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
  mounted() {
    this.getTabElement().addEventListener("auxclick", this.onMiddleClick);
  },
  beforeUnmount() {
    this.getTabElement().removeEventListener("auxclick", this.onMiddleClick);
  },
  methods: {
    onRightClick(event: MouseEvent) {
      event.preventDefault();
      PopoutsModule.ShowPopout({
        id: "context",
        component: "TabContextMenu",
        key: this.tab.name + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          tab: this.tab,
        },
      });
    },
    getTabElement() {
      return (this.$refs?.tab as any).$el as HTMLElement;
    },
    onMiddleClick(event: MouseEvent) {
      if (event.button === 1) {
        event.preventDefault();
        this.closeTab();
      }
    },
    openTab() {
      TabsModule.openTab({ ...this.tab, opened: true });
    },
    closeTab() {
      if (!this.tab.path) return;
      TabsModule.closeTabByPath(this.tab.path);
    },
  },
  computed: {
    seed(): string | undefined {
      return this.tab.server_id || this.tab.user_id;
    },
    user(): User | undefined {
      if (!this.tab.user_id) return undefined;
      return UsersModule.users[this.tab.user_id];
    },
    server(): Server | undefined {
      if (!this.tab.server_id) return undefined;
      return ServersModule.servers[this.tab.server_id];
    },
    title(): string {
      if (this.user && !this.isSavedNotes) {
        return this.user.username;
      }
      return this.tab.name;
    },
    avatar(): string | undefined {
      return this.user?.avatar || this.server?.avatar;
    },
    isSavedNotes(): boolean {
      return this.tab.user_id === MeModule.user.id;
    },
    serverNotificationExists(): any {
      if (!this.server) return false;
      if (!this.tab.channel_id) return false;
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.tab.channel_id
      );
    },
    dmNotificationExists(): any {
      if (!this.user) return false;
      if (!this.tab.user_id) return false;
      return NotificationsModule.notificationByUserID(this.tab.user_id)?.count;
    },
    showAlert(): any {
      return this.serverNotificationExists || this.dmNotificationExists;
    },
  },
});
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  align-self: center;
  cursor: pointer;
  max-width: 200px;
  text-decoration: none;
  color: white;
  .status {
    width: 10px;
    margin-left: 0;
  }

  &:hover {
    .close-button.material-icons {
      opacity: 1;
    }
  }
  &.selected {
    background: rgb(0, 0, 0, 0.3);
    .title {
      color: white;
    }
    .close-button.material-icons {
      opacity: 1;
    }
  }
}

.outer-title {
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  align-content: center;
  height: 100%;

  &.showAlert:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    height: 3px;
    background: var(--alert-color);
  }
}
.title {
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: italic;
  padding-right: 2px;
}
.opened .title {
  font-style: initial;
}

.icon {
  font-size: 20px;
  margin-right: 3px;
}
.close-button.material-icons {
  font-size: 14px;
  margin-left: 3px;
  padding: 5px;
  opacity: 0;
  border-radius: 4px;
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
