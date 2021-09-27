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
import Channel from "@/interfaces/Channel";
import { PropType, markRaw } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChannelSuggestion",
  components: { SuggestionPopoutTemplate },
  emits: ["selected"],
  props: {
    channels: {
      type: Array as PropType<Channel[]>,
      required: true,
    },
  },
  data() {
    return {
      ChannelSuggestionTemplate: markRaw(ChannelSuggestionTemplate),
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
    onSelected(channel: Channel) {
      this.$emit("selected", `#${channel.name}# `);
    },
  },
});
</script>
<style scoped></style>
