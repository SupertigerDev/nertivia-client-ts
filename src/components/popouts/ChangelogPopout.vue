<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="generic-popout">
      <div class="content animate-in">
        <div class="header">
          <div
            class="material-icons back-button"
            @click="close"
            :title="$t('back')"
          >
            close
          </div>
          <div class="text">Changes</div>
        </div>
        <div class="inner-content" v-if="logs">
          <ChangelogTemplate v-for="(log, i) in logs" :key="i" :log="log" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import ChangelogTemplate from "./ChangelogTemplate.vue";
import { Changelog, getChangelog } from "@/services/updateService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { ChangelogTemplate },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      logs: null as Changelog[] | null,
    };
  },
  mounted() {
    getChangelog().then((logs) => {
      this.logs = logs;
    });
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    backgroundClick(event: any) {
      if (!event.target.classList.contains("popout-background")) return;
      this.close();
    },
    buttonClicked() {
      this.close();
    },
  },
});
</script>
<style lang="scss" scoped>
.generic-popout {
  background: var(--popout-color);
  border-radius: 4px;
  max-width: 500px;
  max-height: 500px;
  min-width: 200px;
  min-height: 200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  overflow: hidden;
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
  height: 30px;
  flex-shrink: 0;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 5px;
  }
  .back-button {
    margin-left: 5px;
    cursor: pointer;
    transition: 0.2s;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.description {
  margin-top: 40px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
}
@media (max-width: 500px) {
  .generic-popout {
    max-height: initial;
    height: 100%;
  }
}
</style>
