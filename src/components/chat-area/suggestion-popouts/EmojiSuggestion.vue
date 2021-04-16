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
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { SuggestionPopoutTemplate } })
export default class Suggestion extends Vue {
  @Prop() private emojis!: any[];
  EmojiSuggestionTemplate = EmojiSuggestionTemplate;

  up() {
    (this.$refs.template as any).up();
  }
  down() {
    (this.$refs.template as any).down();
  }
  enter() {
    (this.$refs.template as any).enter();
  }
  onSelected(emoji: any) {
    if (emoji.unicode) {
      this.$emit("selected", `:${emoji.shortcodes[0]}: `);
    } else {
      this.$emit("selected", `:${emoji.name}: `);
    }
  }
}
</script>
<style scoped></style>
