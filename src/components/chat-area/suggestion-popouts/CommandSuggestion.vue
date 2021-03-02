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
import { Component, Prop, Vue } from "vue-property-decorator";
import Channel from "@/interfaces/Channel";
import { BotCommand } from "@/store/modules/botCommands";
import User from "@/interfaces/User";

@Component({ components: { SuggestionPopoutTemplate } })
export default class ChannelSuggestion extends Vue {
  @Prop() private commands!: {
    command: BotCommand;
    bot: User;
    insert: boolean;
  }[];
  CommandSuggestionTemplate = CommandSuggestionTemplate;

  up() {
    (this.$refs.template as any).up();
  }
  down() {
    (this.$refs.template as any).down();
  }
  enter() {
    (this.$refs.template as any).enter();
  }
  onSelected(item: any) {
    if (!item.insert) return;
    this.$emit("selected", `${item.bot.botPrefix}${item.command.c} `);
  }
}
</script>
<style scoped></style>
