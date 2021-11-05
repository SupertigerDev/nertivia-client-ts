<template>
  <div class="settings-drawer">
    <div class="items">
      <div
        class="item"
        v-for="(page, index) in pages"
        :key="index"
        :class="{ selected: page.id === currentSettingTab }"
        @click="changeTab(page.id)"
      >
        <div class="material-icons">{{ page.icon }}</div>
        <div class="name">{{ $t(`server-settings.tab-names.${page.id}`) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServersModule } from "@/store/modules/servers";
import settingsPages from "@/utils/serverSettingsPages.json";
import { DrawersModule } from "@/store/modules/drawers";
import { permissions } from "@/constants/rolePermissions";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  computed: {
    currentSettingTab(): any {
      return this.$route.params.tab;
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    isAdmin(): any {
      return ServerMembersModule.isAdmin(
        MeModule.user.id || undefined,
        this.serverID
      );
    },
    isCreator(): any {
      return this.server?.creator?.id === MeModule.user.id;
    },
    pages(): any {
      return Object.values(settingsPages).filter((p: any) => {
        const isAdminOrCreator = this.isCreator || this.isAdmin;
        if (p.owner && !this.isCreator) return false;
        if (p.permission && !isAdminOrCreator) {
          return ServerMembersModule.memberHasPermission(
            MeModule.user.id || "",
            this.serverID,
            permissions[p.permission].value
          );
        }
        if (p.admin && !isAdminOrCreator) return false;
        return true;
      });
    },
  },
  methods: {
    changeTab(path: string) {
      DrawersModule.SetLeftDrawer(false);
      this.$router.push({ params: { tab: path } });
    },
  },
});
</script>
<style lang="scss" scoped>
.settings-drawer {
  width: 250px;
}
.item {
  display: flex;
  align-items: center;
  align-content: center;
  height: 30px;
  margin: 4px;
  padding-left: 4px;
  cursor: pointer;
  position: relative;
  overflow: auto;
  user-select: none;
  color: white;
  opacity: 0.8;
  border-radius: 4px;
  transition: 0.2s;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 4px;
    transition: 0.1s;
    border-radius: 4px;
  }

  .name {
    margin-left: 4px;
  }
  .material-icons {
    margin-left: 5px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 0.4;
    }
    opacity: 1;
  }
  &.selected {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
    &:before {
      background: var(--primary-color);
      opacity: 1;
    }
  }
}
@media (max-width: 950px) {
  .settings-drawer {
    padding-bottom: 56px;
  }
}
</style>
