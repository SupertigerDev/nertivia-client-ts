<template>
  <div
    class="image-embed"
    :class="{ animate: isWindowFocused && !loaded, loaded, isGif, failed }"
    :style="{
      '--width': image.dimensions.width + 'px',
      '--height': image.dimensions.height + 'px',
      '--aspect': `${image.dimensions.width} / ${image.dimensions.height}`
    }"
    @click="onClick"
  >
    <img
      :src="pauseGifURL"
      :width="image.dimensions.width"
      :height="image.dimensions.height"
      loading="lazy"
      @load="loaded = true"
      @error="failed = true"
    />
    <div class="overlay">
      <div class="gif">GIF</div>
    </div>
  </div>
</template>

<script lang="ts">
import windowProperties from "@/utils/windowProperties";
import { PopoutsModule } from "@/store/modules/popouts";
import Vue, { PropType } from "vue";
export default Vue.extend({
  name: "ImageMessageEmbed",
  props: {
    image: {
      type: Object as PropType<any>,
      required: false
    }
  },
  data() {
    return {
      loaded: false,
      failed: false
    };
  },
  computed: {
    isWindowFocused(): any {
      return windowProperties.isFocused;
    },
    pauseGifURL(): any {
      let url = this.imageURL;
      if (!this.isWindowFocused && this.isGif) {
        url += `?type=webp`;
      }
      return url;
    },
    isGif(): any {
      return this.imageURL?.endsWith(".gif");
    },
    imageURL(): any {
      return (
        process.env.VUE_APP_IMAGE_PROXY_URL + encodeURIComponent(this.image.url)
      );
    }
  },
  methods: {
    onClick() {
      PopoutsModule.ShowPopout({
        id: "image-preview-popout",
        component: "image-preview-popout",
        data: {
          url: this.imageURL
        }
      });
    }
  }
});
</script>

<style scoped lang="scss">
.image-embed {
  display: grid;
  grid-template: "a" minmax(auto, 500px) / minmax(auto, 500px);

  border-radius: 4px;
  overflow: hidden;

  aspect-ratio: var(--aspect);
  min-height: 100px;
  min-width: 100px;

  max-width: min(100%, 500px);
  max-height: 500px;

  cursor: pointer;

  background: rgba(0, 0, 0, 0.3);

  &.failed,
  &.failed img {
    aspect-ratio: unset;
    width: 2rem;
    height: 2rem;
  }

  &:not(.isGif) .gif {
    visibility: hidden;
  }

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

img {
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
