<template>
  <SuggestionPopoutTemplate
    :items="commands"
    ref="template"
    :template="CommandSuggestionTemplate"
    @selected="onSelected"
  />
</template>

<script lang="ts">
import SuggestionPopoutTemplate from "./SuggestionPopoutTemplate.vue";
import CommandSuggestionTemplate from "./CommandSuggestionTemplate.vue";
import { BotCommand } from "@/store/modules/botCommands";
import User from "@/interfaces/User";
import { PropType } from "vue";
import { defineComponent, markRaw } from "vue";
export default defineComponent({
  name: "ChannelSuggestion",
  components: { SuggestionPopoutTemplate },
  emits: ["selected"],
  props: {
    commands: {
      type: Array as PropType<
        {
          command: BotCommand;
          bot: User;
          insert: boolean;
        }[]
      >,
      required: true,
    },
  },
  data() {
    return {
      CommandSuggestionTemplate: markRaw(CommandSuggestionTemplate),
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
    onSelected(item: any) {
      if (!item.insert) return;
      this.$emit("selected", `${item.bot.botPrefix}${item.command.c} `, true);
    },
  },
});
</script>
<style scoped></style>
