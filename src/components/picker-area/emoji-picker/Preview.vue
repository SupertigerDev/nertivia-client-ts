<template>
  <div class="preview">
    <div class="inner-content" v-if="hoveredEmoji">
      <div v-if="hoveredEmoji.addButton" class="emoji add">
        <div class="material-icons">add</div>
      </div>
      <div class="emoji" v-else v-html="image" />
      <div class="details">
        <div class="name" v-if="name">{{ name }}</div>
        <div class="shortcode" v-if="shortCode">:{{ shortCode }}:</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Preview",
  props: {
    hoveredEmoji: {
      type: Object as any,
      required: false,
    },
  },
  computed: {
    shortCode(): any {
      if (this.hoveredEmoji.name) return this.hoveredEmoji.name;
      else return this.hoveredEmoji.shortcodes?.[0];
    },
    name(): any {
      if (!this.hoveredEmoji.annotation) return null;
      return this.hoveredEmoji.annotation;
    },
    image(): any {
      const { el, id, gif } = this.hoveredEmoji;
      if (el) return el;
      const image = new Image();
      image.classList.add("emoji");

      image.src = `${process.env.VUE_APP_NERTIVIA_CDN}emojis/${id}.${
        gif ? "gif" : "png"
      }`;
      return image.outerHTML;
    },
  },
});
</script>

<style scoped></style>

<style lang="scss" scoped>
.preview {
  border-top: solid 1px rgba(255, 255, 255, 0.1);
  height: 50px;
  flex-shrink: 0;
  display: flex;
}
.inner-content {
  display: flex;
  align-items: center;
}
.emoji {
  margin-left: 10px;
  height: 30px;
  flex-shrink: 0;
  width: 30px;
  &.add {
    display: flex;
    align-items: center;
    align-content: center;
  }
}
.details {
  margin-left: 10px;
  font-size: 14px;
  .shortcode {
    opacity: 0.6;
  }
}
</style>
<style>
.preview .emoji img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
</style>
