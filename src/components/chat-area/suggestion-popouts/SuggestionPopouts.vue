<template>
  <div class="suggestion-popouts" v-if="show">
    <div class="debug" v-if="debug">
      <b>DEBUG:</b><br />
      value: {{ value }}<br />
      cursorPosition: {{ cursorPosition }}<br />
      word: {{ word }}<br />
      cursorLetter: {{ cursorLetter }}<br />
      suggestChannels: {{ suggestChannels.length }} <br />
      suggestMentions: {{ suggestMentions.length }} <br />
      suggestEmojis: {{ suggestEmojis.length }} <br />
      suggestCommands: {{ suggestCommands.length }} <br />
    </div>

    <UserSuggestion
      v-else-if="suggestMentions.length"
      :users="suggestMentions"
      @selected="onSelected"
      ref="showingSuggestion"
    />
    <ChannelSuggestion
      v-else-if="suggestChannels.length"
      :channels="suggestChannels"
      @selected="onSelected"
      ref="showingSuggestion"
    />
    <EmojiSuggestion
      v-else-if="suggestEmojis.length"
      :emojis="suggestEmojis"
      @selected="onSelected"
      ref="showingSuggestion"
    />
    <CommandSuggestion
      v-else-if="suggestCommands.length"
      :commands="suggestCommands"
      @selected="onSelected"
      ref="showingSuggestion"
    />
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import ChannelSuggestion from "./ChannelSuggestion.vue";
import CommandSuggestion from "./CommandSuggestion.vue";
import UserSuggestion from "./UserSuggestion.vue";
import EmojiSuggestion from "./EmojiSuggestion.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import { MessageInputModule } from "@/store/modules/messageInput";
import User from "@/interfaces/User";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { MeModule } from "@/store/modules/me";
import emojiParser from "@/utils/emojiParser";
import { BotCommand, botCommandsModule } from "@/store/modules/botCommands";

@Component({
  components: {
    ChannelSuggestion,
    UserSuggestion,
    EmojiSuggestion,
    CommandSuggestion
  }
})
export default class SuggestionPopouts extends Vue {
  debug = false;
  value = "";
  cursorPosition = 0;
  word = "";
  cursorLetter = "";
  inputEl: null | any = null;
  onkeyUp(event?: any) {
    if (!this.inputEl) {
      this.inputEl = event.target;
    }
    if (!this.inputEl) return;
    this.value = this.inputEl.value;
    this.cursorPosition = this.inputEl.selectionStart;
    this.word = this.cursorWord(this.value, this.cursorPosition);
    this.cursorLetter = this.value.substring(
      this.cursorPosition - 1,
      this.cursorPosition
    );
  }
  onArrowUp() {
    (this.$refs.showingSuggestion as any).up();
  }
  onArrowDown() {
    (this.$refs.showingSuggestion as any).down();
  }
  onEnter() {
    (this.$refs.showingSuggestion as any).enter();
  }
  cursorWord(text: string, caretPos: number) {
    const preText = text.substring(0, caretPos).replace(/\n/g, " ");
    if (preText.indexOf(" ") > 0) {
      const words = preText.split(" ");
      return words[words.length - 1]; //return last word
    } else {
      return preText;
    }
  }
  onSelected(val: string, replaceAll) {
    const start = this.cursorPosition - this.word.length;
    const end = this.cursorPosition;
    if (replaceAll) {
      this.message = val;
    } else {
      this.message =
        this.message.substring(0, start) + val + this.message.substring(end);
    }
    this.$nextTick(() => {
      this.inputEl?.focus();
      this.onkeyUp();
    });
  }
  resetValues() {
    this.value = "";
    this.cursorPosition = 0;
    this.word = "";
    this.cursorLetter = "";
  }

  @Watch("channelID")
  onChannelChange() {
    this.resetValues();
  }
  @Watch("message")
  onMessageChange(message: string) {
    if (!message.trim().length) {
      this.resetValues();
    }
  }
  get wordWithoutBeginning() {
    return this.word.slice(1, this.word.length);
  }

  get suggestChannels() {
    if (!this.serverID) return [];
    if (!this.word.startsWith("#")) return [];
    if (this.cursorLetter.trim() == "" || this.word.endsWith("#")) return [];
    return (
      ChannelsModule.serverChannels(this.serverID)
        .filter(c => {
          const name = c.name?.toLowerCase().replace(/\s/g, "");
          return name?.includes(this.wordWithoutBeginning.toLowerCase());
        })
        // sort by first matching first letter
        .sort(a => {
          const firstLetter = a?.name?.[0].toLowerCase();
          if (this.wordWithoutBeginning[0].toLowerCase() === firstLetter) {
            return -1;
          }
          return 1;
        })
        .slice(0, 10)
    );
  }
  get suggestMentions() {
    if (!this.word.startsWith("@")) return [];
    if (!this.serverID) {
      const arr: any[] = [];
      this.dmChannel?.recipients?.[0] && arr.push(this.dmChannel.recipients[0]);
      MeModule.user && arr.push(MeModule.user);
      return this.searchMention(arr);
    }
    return this.searchMention(
      ServerMembersModule.getUsersFromServer(this.serverID)
    ).slice(0, 10);
  }
  get suggestCommands() {
    const args = this.value.trim().split(" ");
    if (args.length >= 45) return [];
    if (!this.botWithPrefixes.length) return [];
    if (!this.botCommands.length) return [];

    const matchedCommands: {
      bot: User;
      command: BotCommand;
      insert: boolean;
      argsEnteredLength: number;
    }[] = [];
    for (let i = 0; i < this.botWithPrefixes.length; i++) {
      const bot = this.botWithPrefixes[i];
      if (!bot.botPrefix) continue;
      if (!args[0].startsWith(bot.botPrefix)) continue;
      const botCommands = botCommandsModule.botCommands[bot.id];
      if (!botCommands?.length) continue;
      for (let y = 0; y < botCommands.length; y++) {
        const command = botCommands[y];
        const commandSplit = command.c.split(" ");
        const userCommandSplit = args.slice(0, commandSplit.length);
        if (!userCommandSplit.length) continue;
        userCommandSplit[0] = userCommandSplit[0].slice(bot.botPrefix.length);
        if (!commandSplit.join(" ").startsWith(userCommandSplit.join(" ")))
          continue;

        matchedCommands.push({
          command,
          bot,
          argsEnteredLength: args.slice(userCommandSplit.length).length,
          // true = autofill command
          // false = send message
          insert: !this.value.startsWith(bot.botPrefix + command.c + " ")
        });
      }
    }

    // for (let i = 0; i < this.botWithPrefixes.length; i++) {
    //   const bot = this.botWithPrefixes[i];
    //   if (!bot.botPrefix) continue;
    //   if (!cmd.startsWith(bot.botPrefix)) continue;
    //   const botCommands = botCommandsModule.botCommands[bot.id];
    //   if (!botCommands?.length) continue;
    //   for (let y = 0; y < botCommands.length; y++) {
    //     const command = botCommands[y];
    //     const prefixAndCommand = (bot.botPrefix + command.c).toLowerCase();
    //     const commnadSplit = prefixAndCommand.split(" ");
    //     const typedCommandSplit =
    //     if (!prefixAndCommand.startsWith(cmd.toLowerCase())) continue;
    //     matchedCommands.push({
    //       command,
    //       bot,
    //       argsEnteredLength: args.length - commnadSplit.length + 1,
    //       insert: !cmd.toLowerCase().startsWith(prefixAndCommand)
    //     });
    //   }
    // }
    return matchedCommands;
  }

  searchMention(users: User[]) {
    return (
      users
        .filter(u => {
          const name = u.username.toLowerCase().replace(/\s/g, "");
          return name?.includes(this.wordWithoutBeginning.toLowerCase());
        })
        // sort by first matching first letter
        .sort(a => {
          const firstLetter = a.username[0].toLowerCase();
          if (this.wordWithoutBeginning[0]?.toLowerCase() === firstLetter) {
            return -1;
          }
          return 1;
        })
    );
  }
  get suggestEmojis() {
    if (this.cursorLetter.trim() == "" || this.word.endsWith(":")) return [];
    if (!this.word.startsWith(":") || this.wordWithoutBeginning.length <= 1)
      return [];
    return emojiParser.searchEmoji(this.wordWithoutBeginning).slice(0, 10);
  }

  get isPopoutShowing() {
    return (
      this.suggestChannels.length ||
      this.suggestMentions.length ||
      this.suggestEmojis.length ||
      this.suggestCommands.filter(c => c.insert).length
    );
  }

  get serverID() {
    if (this.currentTab !== "servers") return undefined;
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2] || "";
  }
  get show() {
    if (!windowProperties.lastClickedElement) return true;
    if (windowProperties.lastClickedElement.closest(".suggestion-popouts"))
      return true;
    if (windowProperties.lastClickedElement.closest(".input-box")) return true;

    return false;
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
  get dmChannel() {
    return ChannelsModule.getDMChannel(this.channelID);
  }
  get botCommands() {
    if (this.serverID) {
      return botCommandsModule.serverCommands(this.serverID);
    } else {
      if (!this.dmChannel?.recipients?.[0].botPrefix) return [];
      return [
        botCommandsModule.botCommands[this.dmChannel.recipients[0].id]
      ];
    }
  }
  get botWithPrefixes() {
    if (this.serverID) {
      return ServerMembersModule.getUsersFromServer(this.serverID).filter(
        u => u.botPrefix
      );
    }
    if (!this.dmChannel?.recipients?.[0].botPrefix) return [];
    return [this.dmChannel?.recipients[0]];
  }
  get message() {
    return MessageInputModule.message;
  }
  set message(val) {
    MessageInputModule.setMessage(val);
  }
}
</script>

<style scoped>
.suggestion-popouts {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 5px;
  left: 40px;
  z-index: 111111111111111;
}
.debug {
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 5px;
}
</style>
