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
    </div>
    <UserSuggestion
      v-if="suggestMentions.length"
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
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import ChannelSuggestion from "./ChannelSuggestion.vue";
import UserSuggestion from "./UserSuggestion.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import { MessageInputModule } from "@/store/modules/messageInput";
import User from "@/interfaces/User";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { MeModule } from "@/store/modules/me";

@Component({
  components: { ChannelSuggestion, UserSuggestion }
})
export default class SuggestionPopouts extends Vue {
  debug = false;
  value = "";
  cursorPosition = 0;
  word = "";
  cursorLetter = "";
  onkeyUp(event: any) {
    this.value = event.target.value;
    this.cursorPosition = event.target.selectionStart;
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
  onSelected(val: string) {
    const start = this.cursorPosition - this.word.length;
    const end = this.cursorPosition;

    this.message =
      this.message.substring(0, start) + val + this.message.substring(end);
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

  get isPopoutShowing() {
    return this.suggestChannels.length || this.suggestMentions;
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
