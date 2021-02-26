<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="margin" ref="margin">
      <div class="content" ref="content">
        <div class="animate-in">
          <!-- TODO: use image message embed technices to load image -->
          <img :src="data.url" class="image" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import resizeKeepAspect from "@/utils/resizeKeepAspect";
import WindowProperties from "@/utils/windowProperties";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class ProfilePopout extends Vue {
  @Prop() private data!: {
    url: string;
    dimensions: { height: number; width: number };
  };
  mounted() {
    this.setDimensions();
  }
  @Watch("windowSize")
  setDimensions() {
    resizeKeepAspect(
      this.$refs.content,
      this.$refs.margin,
      this.data.dimensions.width,
      this.data.dimensions.height,
      false
    );
  }
  backgroundClick(event: any) {
    if (
      event.target.classList.contains("popout-background") ||
      event.target.classList.contains("animate-in")
    ) {
      PopoutsModule.ClosePopout("image-preview-popout");
    }
  }
  get windowSize() {
    return {
      height: WindowProperties.resizeHeight,
      width: WindowProperties.resizeWidth
    };
  }
}
</script>
<style lang="scss" scoped>
.content {
  margin: auto;
  overflow: hidden;
  background: rgb(0, 0, 0);

  border-radius: 4px;
}
.image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  user-select: none;
  pointer-events: all;
}

.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
  display: flex;
  max-height: 100%;
  max-width: 100%;
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

  pointer-events: all;
}
.margin {
  display: flex;
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  pointer-events: none;
}
</style>
