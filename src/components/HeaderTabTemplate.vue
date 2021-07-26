<template>
  <router-link
    class="tab"
    :title="tab.name"
    :class="{ selected, opened: tab.opened }"
    :to="tab.path"
    ref="tab"
    @dblclick.native="openTab"
  >
    <div class="icon material-icons" v-if="tab.icon">{{ tab.icon }}</div>
    <AvatarImage v-if="seed" size="20px" :imageId="avatar" :seedId="seed" />
    <div class="title">{{ tab.name }}</div>
    <div class="close-button material-icons" @click.prevent="closeTab">
      close
    </div>
  </router-link>
</template>

<script lang="ts">
import { Tab, TabsModule } from "@/store/modules/tabs";
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { UsersModule } from "@/store/modules/users";
import { ServersModule } from "@/store/modules/servers";

@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
  @Prop() private selected!: boolean;
  @Prop() private tab!: Tab;
  @Ref("tab") readonly tabComponent!: any;
  mounted() {
    this.tabComponent.$el.addEventListener("auxclick", this.onMiddleClick);
  }
  beforeDestroy() {
    this.tabComponent.$el.removeEventListener("auxclick", this.onMiddleClick);
  }
  openTab() {
    TabsModule.openTab({ ...this.tab, opened: true });
  }
  onMiddleClick(event: MouseEvent) {
    if (event.button === 1) {
      event.preventDefault();
      this.closeTab();
    }
  }
  closeTab() {
    if (!this.tab.path) return;
    TabsModule.closeTabByPath(this.tab.path);
  }
  get avatar() {
    return this.user?.avatar || this.server?.avatar;
  }
  get seed() {
    return this.tab.server_id || this.tab.user_id;
  }
  get user() {
    if (!this.tab.user_id) return undefined;
    return UsersModule.users[this.tab.user_id];
  }
  get server() {
    if (!this.tab.server_id) return undefined;
    return ServersModule.servers[this.tab.server_id];
  }
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  height: 26px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  align-self: center;
  cursor: pointer;
  max-width: 200px;
  text-decoration: none;

  &:hover {
    .close-button.material-icons {
      opacity: 1;
    }
  }
  &.selected {
    background: rgba(0, 0, 0, 0.6);
    .title {
      color: white;
    }
    .close-button.material-icons {
      opacity: 1;
    }
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
