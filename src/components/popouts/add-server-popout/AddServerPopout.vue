<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="add-server-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="icon material-icons">dns</div>
          <div class="text">{{ $t("add-server-popout.title") }}</div>
        </div>
        <TabLayout :tabs="tabs" />
        <!-- <div class="inner-content">
          <div class="tabs">
            <div class="tab" :class="{ selected: tab === 0 }" @click="tab = 0">
              {{ $t("add-server-popout.tabs.join") }}
            </div>
            <div class="tab" :class="{ selected: tab === 1 }" @click="tab = 1">
              {{ $t("add-server-popout.tabs.create") }}
            </div>
          </div>
          <div class="container">
            <transition :name="tab === 1 ? 'slide-left' : 'slide-right'">
              <JoinServer v-if="tab === 0" key="joinServer" />
              <CreateServer v-if="tab === 1" key="addServer" />
            </transition>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import CreateServer from "./CreateServer.vue";
import JoinServer from "./JoinServer.vue";
import TabLayout from "@/components/TabLayout.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { TabLayout },
  computed: {
    tabs(): any {
      return [
        { name: this.$t("add-server-popout.tabs.join"), component: JoinServer },
        {
          name: this.$t("add-server-popout.tabs.create"),
          component: CreateServer,
        },
      ];
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("add-server");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.add-server-popout {
  background: var(--popout-color);
  border-radius: 4px;
  overflow: hidden;
  max-width: 400px;
  width: 100%;
  height: 400px;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 4px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inner-content {
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
    width: 60px;
    margin-top: 5px;
    margin-bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    cursor: pointer;
    user-select: none;
    height: 30px;
    opacity: 0.6;
    transition: 0.2s;
    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.05);
    }
    &.selected {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.container {
  height: 100%;
  margin-top: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
</style>
