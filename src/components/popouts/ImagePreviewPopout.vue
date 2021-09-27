<template>
  <div class="popout-container" @click="backgroundClick">
    <div class="image-container">
      <img ref="image" :src="data.url" @contextmenu="showContext" />
    </div>

    <!-- :style="{ backgroundImage: `url(${data.url})` }" -->
    <div class="outer-options">
      <div class="options">
        <ButtonTemplate
          icon="download"
          title="Download Image"
          @click="downloadImage"
        />
        <a :href="data.url" target="_blank" rel="noopener noreferrer">
          <ButtonTemplate icon="launch" title="Open Image"
        /></a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import ButtonTemplate from "@/components/CustomButton.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { ButtonTemplate },
  props: {
    data: {
      type: Object as PropType<{
        url: string;
        unsafe_url: string;
      }>,
      required: true,
    },
  },
  methods: {
    showContext(event: any) {
      if (!this.$isElectron) return;
      event.preventDefault();
      PopoutsModule.ShowPopout({
        id: "context",
        component: "ImageContextMenu",
        key: this.data.url + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          imageUrl: this.data.url,
        },
      });
    },
    async downloadImage() {
      const a = document.createElement("a");
      a.href = await this.toDataURL(this.data.url);
      a.download = this.basename(this.data.unsafe_url || this.data.url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    async toDataURL(url) {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    basename(path: string) {
      return path.substring(path.lastIndexOf("/") + 1);
    },
    backgroundClick(event: any) {
      if (event.target.closest(".options")) return;
      PopoutsModule.ClosePopout("image-preview-popout");
    },
  },
});
</script>
<style lang="scss" scoped>
.popout-container {
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;
  align-items: center;
  align-content: center;

  box-sizing: border-box;
  background: rgb(12 12 14 / 0.658);
  z-index: 10;
  pointer-events: all;
}
a {
  text-decoration: none;
  display: flex;
}
.outer-options {
  align-items: center;
  align-content: center;
  margin-bottom: auto;
  padding-bottom: 5px;
}
.options {
  display: flex;
  height: 50px;
  background: var(--card-color);
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}
.image-container {
  max-width: 80%;
  max-height: calc(100% - 70px);
  margin: auto;
  margin-bottom: 10px;
  img {
    object-fit: contain;
    display: block;
    max-width: 100%;
    width: 100%;
    height: 100%;
  }
  // background-size: contain;
  // background-position: center;
  // background-repeat: no-repeat;
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
@media (max-width: 950px) {
  .image-container {
    max-width: 100%;
  }
}
</style>
