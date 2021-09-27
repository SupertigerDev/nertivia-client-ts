<template>
  <div
    class="image-embed"
    :class="{ animate: isWindowFocused }"
    @click="onClick"
  >
    <div class="outer-content">
      <div class="inner-content" ref="content">
        <div class="gif" v-if="isGif">GIF</div>
        <img
          @contextmenu="showContext"
          :src="pauseGifURL"
          :class="{ loaded }"
          :width="dimensions.width"
          :height="dimensions.height"
          loading="lazy"
          @load="loaded = true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWindowProperties } from "@/utils/windowProperties";
import Message from "@/interfaces/Message";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImageMessageEmbed",
  props: {
    message: {
      type: Object as PropType<Message & { grouped: boolean }>,
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    isWindowFocused(): any {
      return useWindowProperties().isFocused;
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
      const file = this.message.files?.[0];
      if (!file) return undefined;
      // nertivia cdn
      if (file.url) return file.url;
      // google drive cdn
      return (
        process.env.VUE_APP_FETCH_PREFIX +
        `/media/${file.fileID}/${file.fileName}`
      );
    },
    dimensions(): any {
      return this.message.files?.[0]?.dimensions;
    },
  },
  methods: {
    showContext(event: any) {
      if (!this.$isElectron) return;
      event.preventDefault();
      PopoutsModule.ShowPopout({
        id: "context",
        component: "ImageContextMenu",
        key: this.imageURL + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          imageUrl: this.imageURL,
        },
      });
    },
    onClick() {
      PopoutsModule.ShowPopout({
        id: "image-preview-popout",
        component: "image-preview-popout",
        data: {
          url: this.imageURL,
          unsafe_url: this.message.files?.[0].url,
        },
      });
    },
  },
});
</script>

<style scoped lang="scss">
.image-embed {
  margin-top: 5px;
  position: relative;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);

  overflow: hidden;
  cursor: pointer;
  &:hover {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.outer-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-content {
  display: grid;
}

img {
  display: grid;

  height: auto;

  min-width: 200px;
  min-height: 200px;

  max-width: 500px;
  max-height: 500px;

  object-fit: contain;
}

img.loaded {
  width: 100%;
  height: 100%;
}

.image-embed:hover {
  .gif {
    opacity: 0;
  }
}
.gif {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 3px;
  border-radius: 4px;
  transition: 0.2s;
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
