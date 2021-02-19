<template>
  <div class="container manage-emojis">
    <div class="inner-container">
      <div class="details">
        <div class="description">
          <div class="material-icons">info</div>
          Manage Emojis
        </div>
        <div class="notice">
          Upload your own pretty emojis for free! Emojis must be 3MB or less.
          <div>Supported types are: png, jpg, gif</div>
        </div>
      </div>
      <div class="emoji-count">
        Emojis: <span>{{ count }}/50</span>
      </div>
      <div class="list">
        <EmojiTemplate
          v-for="(emoji, i) in emojiArr"
          :key="emoji.emojiID"
          :defaultFocused="i === 0"
          :emoji="emoji"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import { Component, Vue } from "vue-property-decorator";
import EmojiTemplate from "./EmojiTemplate.vue";

@Component({ components: { EmojiTemplate } })
export default class ManageEmojis extends Vue {
  get emojiArr() {
    return [...CustomEmojisModule.customEmojis].reverse();
  }
  get count() {
    return this.emojiArr.length;
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.details {
  margin: 10px;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
.emoji-count {
  margin-left: 10px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  span {
    color: white;
  }
}
.list {
  overflow: auto;
  padding: 10px;
}
</style>
