<template>
  <div class="tab-layout">
    <div class="tabs">
      <div
        v-for="(tab, i) in tabs"
        :key="tab.id"
        :class="{ selected: i === currentTabIndex }"
        @click="currentTabIndex = i"
        class="tab"
      >
        {{ tab.name }}
      </div>
    </div>
    <div class="tab-layout-container">
      <transition :name="currentTabIndex === 1 ? 'slide-left' : 'slide-right'">
        <component
          v-bind="currentTab.props"
          :is="currentTab.component"
          v-on="events"
        ></component>
      </transition>
    </div>
  </div>
</template>

<script lang="tsx">
import { PropType, h } from "vue";
interface Tab {
  name: string;
  id: string;
  component: any;
  props?: any;
  events?: string[];
}

import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      currentTabIndex: 0,
    };
  },
  props: {
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true,
    },
  },
  methods: {
    onEvent(data: any, name: string) {
      this.$emit("event", {
        eventName: name,
        id: this.currentTab.id,
        data,
      });
    },
  },
  computed: {
    currentTab(): Tab {
      return this.tabs[this.currentTabIndex];
    },

    events(): any {
      const events: any = {};
      this.currentTab.events?.forEach((v) => {
        events[v] = (data: any) => this.onEvent(data, v);
      });
      return events;
    },
  },
});
</script>

<style scoped lang="scss">
.slide-left-leave-active,
.slide-left-enter-active {
  transition: 0.3s;
}
.slide-left-enter-from {
  transform: translate(100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.3s;
}
.slide-right-enter-from {
  transform: translate(-100%, 0);
}
.slide-right-leave-to {
  transform: translate(100%, 0);
}
.tab-layout {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}
.tabs {
  display: flex;
  margin-left: 10px;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 5px;
  margin-bottom: 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  user-select: none;
  height: 30px;
  opacity: 0.6;
  transition: 0.2s;
  border: solid 1px rgba(255, 255, 255, 0);
  border-bottom: none;
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
  }
  &.selected {
    opacity: 1;
    background: var(--card-color);
    border: solid 1px rgba(255, 255, 255, 0.1);
    border-bottom: none;
  }
}
.tab-layout-container {
  height: 100%;
  margin-top: 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  border: solid 1px rgba(255, 255, 255, 0.1);
  background: var(--card-color);

  > div {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
