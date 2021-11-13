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
          <ElectronSources
            v-if="$isElectron"
            @selectedSourceId="selectedSourceId = $event"
          />

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
import Selector from "../../Selector.vue";
import ElectronSources from "./ElectronSources.vue";

import { defineComponent } from "vue";
import { voiceChannelModule } from "@/store/modules/voiceChannels";

export default defineComponent({
  name: "ScreensharePopout",
  components: { CustomButton, Selector, ElectronSources },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      qualityItems: ["480p", "720p", "1080p", "Source"],
      framerateItems: ["30fps", "60fps", "Source"],
      selectedQuality: 3,
      selectedFramerate: 2,
      selectedSourceId: null,
    };
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    async selectWindow() {
      voiceChannelModule.removeVideoStream();
      const constraints = await this.constructConstraints();
      const mediaDevices = navigator.mediaDevices as any;

      let stream: any = null;
      // handle electron
      if (this.selectedSourceId) {
        stream = await mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "desktop",
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: this.selectedSourceId,
              maxFrameRate: constraints.video.frameRate,
              minWidth: constraints.video.width,
              maxWidth: constraints.video.width,
              minHeight: constraints.video.height,
              maxHeight: constraints.video.height,
            },
          },
        });
        await stream.getAudioTracks()[0].applyConstraints(constraints.audio);
      } else {
        stream = await mediaDevices.getDisplayMedia(constraints).catch(() => {
          console.log("Screenshare cancelled.");
        });
      }

      if (this.$isElectron && !this.selectedSourceId) return;

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
        video: {
          height: 0,
          width: 0,
          frameRate: 0,
          resizeMode: null as string | null,
        },
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          googAutoGainControl: false,
          noiseSupperession: false,
        },
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
      constraints.video.resizeMode = "none";
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
  width: 680px;
  height: 600px;
  .selectors {
    flex-direction: row;
    gap: 20px;
  }
  .buttons {
    margin-top: auto;
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
