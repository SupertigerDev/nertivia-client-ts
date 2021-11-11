<template>
  <div v-click-outside="backgroundClick" class="picker-panel">
    <EmojiPicker
      v-if="tab === 'EMOJI'"
      :inputElement="inputElement"
      @click="$emit('click', $event)"
      @close="$emit('close')"
    />
    <GifPicker
      v-if="tab === 'GIF'"
      :inputElement="inputElement"
      @click="$emit('click', $event)"
      @close="$emit('close')"
    />
    <div class="features" v-if="!hideTabs">
      <div
        class="button"
        :class="{ selected: tab === 'EMOJI' }"
        @click="tab = 'EMOJI'"
      >
        Emojis
      </div>
      <div
        class="button"
        :class="{ selected: tab === 'GIF' }"
        @click="tab = 'GIF'"
      >
        GIFs
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from "vue";

const EmojiPicker = defineAsyncComponent(
  () => import("./emoji-picker/EmojiPicker.vue")
);
const GifPicker = defineAsyncComponent(
  () => import("./gif-picker/GifPicker.vue")
);

export default defineComponent({
  components: { EmojiPicker, GifPicker },
  emits: ["close", "click"],
  props: {
    inputElement: Object,
    buttonClassName: {
      type: String,
    },
    defaultTab: {
      type: String as PropType<"EMOJI" | "GIF">,
      default: "EMOJI",
    },
    hideTabs: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      tab: this.defaultTab,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    backgroundClick(event) {
      if (!event.target.closest(this.buttonClassName)) this.close();
    },
  },
});
</script>

<style scoped lang="scss">
.picker-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 99999;
  height: 352px;
  width: 375px;
  z-index: 111111111111111;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
}
.features {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  flex-shrink: 0;
  gap: 10px;
  margin-top: auto;
  .button {
    padding: 5px;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    &.selected {
      background: var(--primary-color);
    }
  }
}
</style>
