<template>
  <div
    class="image-embed"
    :style="{
      '--width': embed.width + 'px',
      '--height': embed.height + 'px',
      '--aspect': `${embed.width} / ${embed.height}`,
    }"
  >
    <video
      class="video"
      :src="embed.url"
      :width="embed.width"
      :height="embed.height"
      :autoplay="isWindowFocused"
      loop
      ref="video"
    ></video>
    <div class="overlay">
      <div class="gif">GIF</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWindowProperties } from "@/utils/windowProperties";
import { PropType } from "vue";
import { defineComponent } from "vue";
interface Tenor {
  url: string;
  width: string;
  height: string;
}
export default defineComponent({
  name: "ImageMessageEmbed",
  props: {
    embed: {
      type: Object as PropType<Tenor>,
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      failed: false,
    };
  },
  computed: {
    isWindowFocused(): any {
      return useWindowProperties().isFocused;
    },
  },
  watch: {
    isWindowFocused: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          const videoEl = this.$refs.video as HTMLVideoElement;
          if (this.isWindowFocused) videoEl?.play?.();
          else videoEl?.pause?.();
        });
      },
    },
  },
});
</script>

<style scoped lang="scss">
.image-embed {
  display: grid;
  grid-template: "a" minmax(auto, 300px) / minmax(auto, 300px);

  border-radius: 4px;
  overflow: hidden;

  aspect-ratio: var(--aspect);
  min-height: 100px;
  min-width: 100px;

  max-width: min(100%, 500px);
  max-height: 500px;

  cursor: pointer;

  background: rgba(0, 0, 0, 0.3);

  &:hover {
    .overlay {
      background: rgba(0, 0, 0, 0.3);
    }

    .gif {
      opacity: 0;
    }
  }
}

.overlay {
  grid-area: a;
  pointer-events: none;
}

.video {
  grid-area: a;

  width: 100%;
  height: 100%;

  max-width: 100%;
  max-height: 100%;

  border-radius: 4px;

  object-fit: contain;
}

.gif {
  margin: 0.33rem;
  width: max-content;

  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);

  padding: 0.11rem 0.33rem;
  border-radius: 0.25rem;
  transition: 0.2s background, 0.2s opacity;
}

.animate {
  animation: animate 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes animate {
  from {
    background: rgba(0, 0, 0, 0.4);
  }
  to {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
