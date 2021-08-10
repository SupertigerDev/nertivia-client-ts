<template>
  <div class="popout-container" @click="backgroundClick">
    <!-- TODO: use image message embed technices to load image -->
    <img :src="data.url" class="image animate-in" />
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import Vue, { PropType } from "vue";
export default Vue.extend({
  name: "ProfilePopout",
  props: {
    data: {
      type: Object as PropType<{
        url: string;
      }>,
      required: false
    }
  },
  methods: {
    backgroundClick(event: any) {
      if (
        event.target.classList.contains("popout-container") ||
        event.target.classList.contains("animate-in")
      ) {
        PopoutsModule.ClosePopout("image-preview-popout");
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.popout-container {
  display: grid;
  place-items: center;
  place-content: center;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  background: rgb(12 12 14 / 0.658);

  z-index: 10;
  pointer-events: all;
}

.image {
  width: auto;
  height: auto;

  max-width: min(90vw, 750px);
  max-height: min(90vh, 750px);

  border-radius: 4px;
  overflow: hidden;
  box-sizing: border-box;

  user-select: none;
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
</style>
