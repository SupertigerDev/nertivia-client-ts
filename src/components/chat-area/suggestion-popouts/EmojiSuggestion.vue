<template>
  <SuggestionPopoutTemplate
    :items="emojis"
    ref="template"
    :template="EmojiSuggestionTemplate"
    @selected="onSelected"
  />
</template>

<script lang="ts">
import SuggestionPopoutTemplate from "./SuggestionPopoutTemplate.vue";
import EmojiSuggestionTemplate from "./EmojiSuggestionTemplate.vue";
import Vue, { PropType } from "vue";
export default Vue.extend({
  name: "Suggestion",
  components: { SuggestionPopoutTemplate },
  props: {
    emojis: {
      type: Array as PropType<any[]>,
      required: false
    }
  },
  data() {
    return {
      EmojiSuggestionTemplate: EmojiSuggestionTemplate
    };
  },
  methods: {
    up() {
      (this.$refs.template as any).up();
    },
    down() {
      (this.$refs.template as any).down();
    },
    enter() {
      (this.$refs.template as any).enter();
    },
    onSelected(emoji: any) {
      if (emoji.unicode) {
        this.$emit("selected", `:${emoji.shortcodes[0]}: `);
      } else {
        this.$emit("selected", `:${emoji.name}: `);
      }
    }
  }
});
</script>
<style scoped></style>
