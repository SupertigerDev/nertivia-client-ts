<template>
  <div class="popout-background">
    <div class="popout" :class="{ electron: $isElectron }">
      <div class="content animate-in">
        <div class="header">
          <div
            class="material-icons back-button"
            @click="close"
            :title="$t('back')"
          >
            close
          </div>
          <div class="text">Screen Share</div>
        </div>
        <div class="inner-content">
          <div class="selectors">
            <Selector
              v-model="selectedQuality"
              class="selector"
              name="Quality"
              :items="qualityItems"
            />
            <Selector
              v-model="selectedFramerate"
              class="selector"
              name="Framerate"
              :items="framerateItems"
            />
          </div>
          <div class="electron-sources" v-if="$isElectron">
            <div
              class="source"
              v-for="source in electronSources"
              :key="source.id"
            >
              <img class="thumbnail" :src="source.thumbnail" alt="" />
              <div class="name">{{ source.name }}</div>
            </div>
          </div>

          <div class="buttons">
            <CustomButton name="Cancel" @click="close" :alert="true" />
            <CustomButton
              name="Select Window"
              @click="selectWindow"
              :filled="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import Selector from "../Selector.vue";

import { defineComponent } from "vue";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import electronBridge from "@/utils/electronBridge";
import { CaptureSource } from "@/interfaces/ElectronBridge";
export default defineComponent({
  name: "ScreenSharePopout",
  components: { CustomButton, Selector },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      electronSources: [] as CaptureSource[],
      qualityItems: ["480p", "720p", "1080p", "Source"],
      framerateItems: ["30fps", "60fps", "Source"],
      selectedQuality: 3,
      selectedFramerate: 2,
    };
  },
  mounted() {
    if (this.$isElectron) this.loadElectronCaptures();
  },

  methods: {
    async loadElectronCaptures() {
      const getCaptureSources = electronBridge?.getCaptureSources;
      if (!getCaptureSources) return;
      this.electronSources = await getCaptureSources();
      console.log(this.electronSources);
    },
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    async selectWindow() {
      const constraints = await this.constructConstraints();
      const mediaDevices = navigator.mediaDevices as any;
      const stream = await mediaDevices
        .getDisplayMedia(constraints)
        .catch(() => {
          console.log("Screenshare cancelled.");
        });
      this.close();
      if (!stream) return;
      voiceChannelModule.addStream({ stream, type: "video" });
    },
    getFPS(): Promise<number> {
      return new Promise((resolve) =>
        requestAnimationFrame((t1) =>
          requestAnimationFrame((t2) => resolve(1000 / (t2 - t1)))
        )
      );
    },
    async getRoundedFps() {
      return Math.round((await this.getFPS()) / 10) * 10;
    },
    async constructConstraints() {
      const constraints = {
        video: { height: 0, width: 0, frameRate: 0 },
        audio: true,
      };
      // quality
      switch (this.selectedQuality) {
        case 0:
          constraints.video = { width: 848, height: 480 } as any;
          break;
        case 1:
          constraints.video = { width: 1280, height: 720 } as any;
          break;
        case 2:
          constraints.video = { width: 1920, height: 1080 } as any;
          break;
        case 3:
          constraints.video = {
            width: window.screen.width,
            height: window.screen.height,
          } as any;
          break;
        default:
          break;
      }
      // framerate
      switch (this.selectedFramerate) {
        case 0:
          constraints.video.frameRate = 30;
          break;
        case 1:
          constraints.video.frameRate = 60;
          break;
        case 2:
          constraints.video.frameRate = await this.getRoundedFps();
          break;
        default:
          break;
      }
      return constraints;
    },
  },
});
</script>
<style lang="scss" scoped>
.popout {
  background: var(--popout-color);
  border-radius: 4px;
  height: 260px;
  width: 300px;
  overflow: hidden;
  display: flex;
  overflow: hidden;
}
.selectors {
  display: flex;
  flex-direction: column;
}
.electron {
  width: 650px;
  height: 600px;
  .selectors {
    flex-direction: row;
    gap: 20px;
  }
}
.electron-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  height: 100%;
  overflow: auto;
  margin-top: 10px;
  .source {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    width: 200px;
    height: 140px;
    background: var(--card-color);
    .name {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 5px;
      margin-bottom: 5px;
      text-align: center;
      margin-right: 5px;
    }
    .thumbnail {
      height: 100%;
      width: 100%;
      object-fit: contain;
      overflow: hidden;
    }
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
  align-self: center;
  height: 100%;
  overflow: auto;
  margin: 10px;
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
