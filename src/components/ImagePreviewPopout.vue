<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="image-preview-popout">
      <div class="content animate-in">
        <img :src="data.url" class="image" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ProfilePopout extends Vue {
  @Prop() private data!: {
    url: string;
  };
  backgroundClick(event: any) {
    if (
      event.target.classList.contains("popout-background") ||
      event.target.classList.contains("image-preview-popout")
    ) {
      PopoutsModule.ClosePopout("image-preview-popout");
    }
  }
}
</script>
<style lang="scss" scoped>
.image-preview-popout {
  overflow: hidden;
  align-items: center;
  align-content: center;
  justify-content: center;
  display: flex;
  width: 90%;
  user-select: none;
  height: 90%;
}
.image {
  border-radius: 8px;
  max-height: 100%;
  max-width: 100%;
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
</style>
