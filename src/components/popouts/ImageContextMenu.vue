<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    @itemClick="itemClick"
    @close="close"
  />
</template>

<script lang="ts">
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImageContextMenu",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x: number;
        y: number;
        imageUrl: string;
      }>,
      required: true,
    },
  },
  data() {
    return {
      img: new Image(),
    };
  },
  beforeMount() {
    this.img.crossOrigin = "Anonymous";
    this.img.src = this.data.imageUrl;
  },
  computed: {
    items(): any {
      const items: any[] = [
        {
          id: "copy_url",
          name: "Copy URL",
          icon: "developer_board",
        },
        {
          id: "copy_image",
          name: "Copy Image (PNG)",
          icon: "developer_board",
        },
      ];

      return items;
    },
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y,
      };
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
    itemClick(item: any) {
      switch (item.id) {
        case "copy_url":
          toClipboard(this.data.imageUrl);
          break;
        case "copy_image":
          this.getImageCanvas(this.img).toBlob((blob) =>
            (navigator.clipboard as any).write([
              new (window as any).ClipboardItem({ "image/png": blob }),
            ])
          );
          break;
        default:
          break;
      }
    },
    getImageCanvas(img: any): HTMLCanvasElement {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      return canvas;
    },
  },
});
</script>

<style scoped></style>
