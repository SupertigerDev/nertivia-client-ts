<template>
  <div class="header">
    <div
      class="open-drawer-button left-drawer material-icons"
      @click="toggleLeftDrawer"
    >
      menu
    </div>
    <Tabs />
    <!-- <AvatarImage
      v-if="DMUser"
      class="avatar"
      :willHaveClickEvent="true"
      :seedId="DMUser.id"
      @click.native="showProfile"
      :imageId="DMUser.avatar"
      size="30px"
    />
    <div class="name" :class="{ clickable: DMChannel }" @click="showProfile">
      {{ title }}
    </div>
    <UserStatusTemplate class="status" v-if="DMUser" :id="DMUser.id" /> -->
    <div
      class="open-drawer-button right-drawer material-icons"
      v-if="isServerChannel"
      @click="toggleRightDrawer"
    >
      menu
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { DrawersModule } from "@/store/modules/drawers";
import { PopoutsModule } from "@/store/modules/popouts";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import Tabs from "@/components/HeaderTabs.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import Vue from "vue";
export default Vue.extend({
  name: "MainApp",
  components: { UserStatusTemplate, AvatarImage, Tabs },
  props: {
    title: {
      type: String,
      required: false
    }
  },
  computed: {
    isServerChannel(): any {
      return this.$route.params.server_id;
    },
    DMChannel(): any {
      return ChannelsModule.getDMChannel(this.$route.params.channel_id);
    },
    DMUser(): any {
      return this.DMChannel?.recipients?.[0];
    }
  },
  methods: {
    toggleLeftDrawer() {
      DrawersModule.SetLeftDrawer(true);
    },
    toggleRightDrawer() {
      DrawersModule.SetRightDrawer(!DrawersModule.rightDrawer);
    },
    showProfile() {
      if (!this.DMUser?.id) return;
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.DMUser.id }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
  background-color: var(--main-header-bg-color);
}
.name {
  margin-left: 10px;
  &.clickable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.open-drawer-button {
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  display: none;
  &.right-drawer {
    margin-right: 5px;
    margin-left: auto;
    display: block;
  }
  &:hover {
    opacity: 1;
  }
}
.status {
  margin-left: 5px;
  padding: 3px;
  border-radius: 4px;
}
.avatar {
  margin-left: 5px;
  margin-right: -5px;
}
@media (max-width: 950px) {
  .left-drawer {
    margin-left: 5px;
    display: block;
  }
}
</style>

<style lang="scss">
.header .status {
  margin-left: 5px;
  padding: 3px;
  border-radius: 4px;
  a {
    color: white;
  }
  .mention {
    color: white;
  }
}
</style>
