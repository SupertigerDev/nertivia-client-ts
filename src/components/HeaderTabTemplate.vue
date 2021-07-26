<template>
  <router-link
    class="tab"
    :class="{ selected, opened: tab.opened }"
    :to="tab.path"
    ref="tab"
    @dblclick.native="openTab"
  >
    <div class="title">{{ tab.name }}</div>
    <div class="close-button material-icons" @click.prevent="closeTab">
      close
    </div>
  </router-link>
</template>

<script lang="ts">
import { Tab, TabsModule } from "@/store/modules/tabs";
import { Component, Prop, Ref, Vue } from "vue-property-decorator";

@Component
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
    event.preventDefault();
    this.closeTab();
  }
  closeTab() {
    if (!this.tab.path) return;
    TabsModule.closeTabByPath(this.tab.path);
  }
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  padding: 5px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  align-self: center;
  cursor: pointer;
  max-width: 200px;
  text-decoration: none;

  &:hover {
    .material-icons {
      opacity: 1;
    }
  }
  &.selected {
    background: rgba(0, 0, 0, 0.6);
    .title {
      color: white;
    }
    .material-icons {
      opacity: 1;
    }
  }
}

.title {
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
}
.opened .title {
  font-style: initial;
}

.material-icons {
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
