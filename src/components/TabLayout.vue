<script lang="tsx">
import Vue, { PropType } from "vue";
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
      currentTab: 0
    };
  },
  props: {
    tabs: Array as PropType<Tab[]>
  },
  render(h) {
    const Tab = ({ props }) => (
      <div
        key={props.index}
        class={{ selected: props.index === this.currentTab, tab: true }}
        onClick={() => {
          this.currentTab = props.index;
        }}
      >
        {props.name}
      </div>
    );

    const Tabs = () => (
      <div class="tabs">
        {this.tabs.map((tab, i) => (
          <Tab props={{ name: tab.name, index: i }} />
        ))}
      </div>
    );
    const customEvents = () => {
      const events = this.tabs[this.currentTab].events;
      const eventObj: any = {};
      if (!events) return eventObj;
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        eventObj[event] = (data: any) => {
          this.$emit("event", {
            eventName: event,
            id: this.tabs[this.currentTab].id,
            data
          });
        };
      }
      return eventObj;
    };
    return (
      <div class="tab-layout">
        <Tabs />
        <div class="tab-layout-container">
          <transition
            name={this.currentTab === 1 ? "slide-left" : "slide-right"}
          >
            {h(this.tabs[this.currentTab].component, {
              props: this.tabs[this.currentTab].props,
              on: customEvents()
            })}
          </transition>
        </div>
      </div>
    );
  }
});
</script>

<style scoped lang="scss">
.slide-left-leave-active,
.slide-left-enter-active {
  transition: 0.3s;
}
.slide-left-enter {
  transform: translate(100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.3s;
}
.slide-right-enter {
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
