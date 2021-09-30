<template>
  <div class="popout-background">
    <div class="welcome-popout">
      <div class="content animate-in">
        <div class="header">
          <img class="icon" src="@/assets/logo.svg" />
          <div class="text">Welcome to Nertivia!</div>
        </div>
        <LoadingScreen v-if="!connected" />
        <div class="container" v-show="connected">
          <template v-for="(page, i) in pages" :key="page">
            <component
              v-show="currentPage === i"
              v-if="i <= maxBeenToIndex"
              @onAction="onAction"
              @close="close"
              :is="page"
              :ref="page"
            />
          </template>
        </div>
        <div class="footer">
          <Button :alert="true" name="Close" @click="close" />
          <div class="current-page">
            {{ currentPage + 1 }}/{{ pages.length }}
          </div>
          <div class="nav-buttons">
            <Button
              :alert="true"
              name="Back"
              :disabled="!currentPage || nextClicked"
              @click="backClick"
            />
            <Button
              name="Next"
              @click="nextClick"
              v-if="!nextClicked && currentPage !== pages.length - 1"
            />
            <Button
              name="Finish"
              @click="close"
              v-if="currentPage === pages.length - 1"
            />
            <Button name="Saving..." disabled v-if="nextClicked" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { PopoutsModule } from "@/store/modules/popouts";
import LoadingScreen from "@/components/LoadingScreen.vue";
import Language from "@/components/settings-area/Language.vue";
const SetProfile = defineAsyncComponent(() => import("./SetProfile.vue"));
const AdditionalProfile = defineAsyncComponent(
  () => import("./AdditionalProfile.vue")
);
const ManageEmojis = defineAsyncComponent(
  () => import("@/components/settings-area/manage-emojis/ManageEmojis.vue")
);
const Thanks = defineAsyncComponent(() => import("./Thanks.vue"));

import Button from "@/components/CustomButton.vue";
import { MeModule } from "@/store/modules/me";
import { welcomeDone } from "@/services/userService";
export default defineComponent({
  name: "Welcome",
  components: {
    Button,
    SetProfile,
    LoadingScreen,
    AdditionalProfile,
    Thanks,
    ManageEmojis,
    Language,
  },
  props: {
    identity: { required: true, type: String },
  },
  data() {
    return {
      pages: [
        "Language",
        "SetProfile",
        "AdditionalProfile",
        "ManageEmojis",
        "Thanks",
      ],
      maxBeenToIndex: 0,
      currentPage: 0,
      nextClicked: false,
    };
  },
  computed: {
    connected() {
      return MeModule.connected;
    },
    currentPageName() {
      return this.pages[this.currentPage];
    },
  },
  watch: {
    currentPage() {
      if (this.currentPage > this.maxBeenToIndex) {
        this.maxBeenToIndex = this.currentPage;
      }
    },
  },
  methods: {
    close() {
      welcomeDone();
      PopoutsModule.ClosePopout(this.identity);
    },
    onAction(goNext: boolean) {
      if (goNext) {
        this.currentPage++;
      }
      this.nextClicked = false;
    },
    backClick() {
      if (!this.currentPage) return;
      this.currentPage--;
    },
    nextClick() {
      if (this.nextClicked) return;
      this.nextClicked = true;
      const pageEl = this.$refs[this.currentPageName] as any;
      pageEl?.onNext();
    },
  },
});
</script>
<style lang="scss" scoped>
.welcome-popout {
  background: var(--popout-color);
  border-radius: 4px;
  overflow: hidden;
  max-width: 700px;
  width: 100%;
  height: 500px;
}

.footer {
  display: flex;
  .current-page {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: rgba(255, 255, 255, 0.7);
  }
  .nav-buttons {
    display: flex;
  }
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
  .icon {
    height: 30px;
    width: 30px;
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

.container {
  height: 100%;
  margin-top: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  overflow: auto;
  position: relative;
}
@media (max-width: 500px) {
  .welcome-popout {
    height: 100%;
    .container > div {
      justify-content: initial;
    }
  }
}
</style>
<style>
.welcome-popout .manage-emojis {
  background: initial;
}
</style>
