<template>
  <SuggestionPopoutTemplate
    :items="channels"
    ref="template"
    :template="ChannelSuggestionTemplate"
    @selected="onSelected"
  />
</template>

<script lang="ts">
import SuggestionPopoutTemplate from "./SuggestionPopoutTemplate.vue";
import ChannelSuggestionTemplate from "./ChannelSuggestionTemplate.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Channel from "@/interfaces/Channel";

@Component({ components: { SuggestionPopoutTemplate } })
export default class ChannelSuggestion extends Vue {
  @Prop() private channels!: Channel[];
  ChannelSuggestionTemplate = ChannelSuggestionTemplate;

  up() {
    (this.$refs.template as any).up();
  }
  down() {
    (this.$refs.template as any).down();
  }
  enter() {
    (this.$refs.template as any).enter();
  }
  onSelected(channel: Channel) {
    this.$emit("selected", `#${channel.name}# `);
  }
}
</script>
<style scoped></style>
