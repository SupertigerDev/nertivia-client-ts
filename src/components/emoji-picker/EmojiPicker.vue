<template>
  <div v-click-outside="closePanel" class="emoji-panel">
    <div class="emoji-panel-inner">
      <Tabs @click="tabClicked" />
      <input type="text" class="input" ref="search" placeholder="Search" />
      <div class="emojis-list">
        <virtual-list :size="37" :remain="11" ref="virtualList">
          <div class="category" v-if="allRecentEmojis.length">Recents</div>

          <div
            class="emoji-row"
            v-for="(e, i) in allRecentEmojis"
            :key="i + 'r'"
          >
            <div class="wrapper">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @mouseover.native="onEmojiHover(em)"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
          <div class="category" v-if="allCustomEmojis.length">
            Custom Emojis
          </div>
          <div
            class="emoji-row"
            v-for="(e, i) in allCustomEmojis"
            :key="i + 'c'"
          >
            <div class="wrapper">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @mouseover.native="onEmojiHover(em)"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
          <div
            v-for="(e, i) in emojiWithGroup"
            :class="`${e.gname ? 'category' : 'emoji-row'}`"
            :key="i"
          >
            <div class="name" v-if="e.gname">{{ e.gname }}</div>
            <div class="wrapper" v-if="!e.gname">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @mouseover.native="onEmojiHover(em)"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
        </virtual-list>
      </div>
      <div class="preview">
        <div class="emoji" v-if="hoveredEmoji" v-html="hoveredEmoji.el"></div>
        <div class="details" v-if="hoveredEmoji">
          <div class="name">{{ hoveredEmoji.annotation }}</div>
          <div class="shortcode">:{{ hoveredEmoji.shortcodes[0] }}:</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmojiTemplate from "./EmojiTemplate";
import VirtualList from "vue-virtual-scroll-list";
import Tabs from "./Tabs";
import { addRecentEmoji, getRecentEmojis } from "@/utils/recentEmojiManager";
import emojiParser from "@/utils/emojiParser";
import { mapState } from "vuex";
import { bus } from "@/main";

export default {
  components: { VirtualList, EmojiTemplate, Tabs },
  data() {
    return {
      emojiWithGroup: [],
      allRecentEmojis: [],
      allCustomEmojis: [],
      hoveredEmoji: null,
      search: ""
    };
  },

  mounted() {
    this.$refs.search.focus();
    setTimeout(() => {
      const z = performance.now();
      this.allCustomEmojis = this.arrToRows(this.customEmojis);
      const o = performance.now();
      console.log("custom emojis took " + Math.round(o - z) + "ms to load.");
    });
    setTimeout(() => {
      const z = performance.now();
      this.allRecentEmojis = this.arrToRows(this.allRecentEmojisArr());
      const o = performance.now();
      console.log("recent emojis took " + Math.round(o - z) + "ms to load.");
    });
    setTimeout(() => {
      const z = performance.now();
      this.emojiWithGroup = this.emojisWithGroup();
      const o = performance.now();
      console.log("emojis took " + Math.round(o - z) + "ms to load.");
      this.$refs.virtualList.forceRender();
    });
  },

  methods: {
    closePanel(event) {
      if (!event.target.closest(".emojis-button")) this.$emit("close");
    },
    onEmojiHover(em) {
      this.hoveredEmoji = { ...em, el: emojiParser.replaceEmojis(em.unicode) };
    },
    emojisWithGroup() {
      const emojis = emojiParser.allEmojis;
      const groups = emojiParser.allGroups;
      const emojisWithGroups = [];
      const row = 10;
      let rowIndex = 0;
      let rowItemIndex = 0;
      let currentGroup = 0;

      for (let index = 0; index < emojis.length; index++) {
        const emoji = emojis[index];
        const math = rowItemIndex % row;
        let startNewRow = math === 0;
        if (index === 0) {
          emojisWithGroups[rowIndex] = { gname: groups[emoji.group] };
        }

        if (currentGroup != emoji.group) {
          currentGroup = emoji.group;
          rowIndex += 1;
          emojisWithGroups[rowIndex] = { gname: groups[emoji.group] };
          startNewRow = true;
        }

        if (startNewRow) {
          rowIndex += 1;
          emojisWithGroups[rowIndex] = [emoji];
          rowItemIndex = 1;
        } else {
          emojisWithGroups[rowIndex].push(emoji);
          rowItemIndex += 1;
        }
      }

      return emojisWithGroups;
    },
    allRecentEmojisArr() {
      const emojis = [];
      for (let index = 0; index < this.recentEmojis.length; index++) {
        const shortcode = this.recentEmojis[index];

        const emoji = emojiParser.allEmojis.find(
          e => e.shortcodes[0] === shortcode
        );

        if (!emoji) {
          const cusEmoji = this.customEmojis.find(
            emoji => emoji.name === shortcode
          );
          if (cusEmoji) {
            emojis.push(cusEmoji);
          }
        } else {
          emojis.push(emoji);
        }
      }
      return emojis;
    },
    emojiSpritePos(emojiIndex) {
      const SIZE = -25;
      const row = 40;
      let top = 0;
      let left = 0;

      for (let index = 0; index < emojiIndex + 1; index++) {
        if (index != 0) {
          if (index % row === 0) {
            top += SIZE;
            left = 0;
          } else {
            left += SIZE;
          }
        }
      }
      return `${left}px ${top}px`;
    },
    arrToRows(emojis) {
      const row = 10;
      let rowIndex = 0;
      const newArr = [];
      for (let index = 0; index < emojis.length; index++) {
        const emoji = emojis[index];

        if (index === 0) {
          newArr[rowIndex] = [emoji];
        } else if (index % row === 0) {
          rowIndex += 1;
          newArr[rowIndex] = [emoji];
        } else {
          newArr[rowIndex].push(emoji);
        }
      }
      return newArr;
    },
    emojiClick(emoji) {
      if (emoji.emojiID) {
        bus.$emit("emojiPanel:Selected", emoji.name);
      } else {
        addRecentEmoji(emoji.shortcodes[0]);
        bus.$emit("emojiPanel:Selected", emoji.shortcodes[0]);
      }
    },
    tabClicked(index) {
      const ROW_SIZE = 37;
      let recentRows = this.allRecentEmojis.length + 1;
      let customEmojiRows = this.allCustomEmojis.length + 1;
      if (!this.allRecentEmojis.length) recentRows = 0;
      if (!this.allCustomEmojis.length) customEmojiRows = 0;
      if (index === "RECENTS") {
        this.$refs.virtualList.setScrollTop(0);
        return;
      }
      if (index === "CUSTOM") {
        this.$refs.virtualList.setScrollTop(recentRows * ROW_SIZE);
        return;
      }
      const rowIndex = this.emojiWithGroup.findIndex(
        r => r.find && r.find(e => e.group === index)
      );
      let offset = rowIndex === 1 ? -ROW_SIZE : +ROW_SIZE;
      if (rowIndex !== 1) {
        if (recentRows) offset -= ROW_SIZE;
        if (customEmojiRows) offset -= ROW_SIZE;
      }
      this.$refs.virtualList.setScrollTop(
        (recentRows + customEmojiRows + rowIndex) * ROW_SIZE + offset
      );
    },
    findGroupEmojiPos(unicode) {
      return emojiParser.allEmojis.find(e => e.unicode === unicode)?.pos;
    }
  },
  computed: {
    recentEmojis() {
      return getRecentEmojis();
    },
    customEmojis() {
      return [];
    }
    // ...mapState("settingsModule", ["recentEmojis", "customEmojis"])
  }
};
</script>

<style scoped lang="scss">
.emoji-panel {
  display: flex;
  flex-direction: column;
  z-index: 99999;
}

.emoji-panel-inner {
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  z-index: 99999;
  height: 352px;
  width: 375px;
  overflow: hidden;
}
.emojis-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.emojis-list div {
  scrollbar-width: thin;
}
.hidden {
  visibility: hidden;
}
.category {
  display: flex;
  height: 37px;
  color: white;
  padding-left: 10px;
  align-items: center;
  align-content: center;
}
.emoji-row .wrapper {
  height: 37px;
  display: flex;
  flex-direction: row;
}

.preview {
  border-top: solid 1px rgba(255, 255, 255, 0.1);
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .emoji {
    margin-left: 10px;
    height: 30px;
    width: 30px;
  }
  .details {
    margin-left: 10px;
    font-size: 14px;
    .shortcode {
      opacity: 0.6;
    }
  }
}
.input {
  margin-left: 5px;
  margin-right: 5px;
  background: transparent;
  outline: none;
  border: solid 2px rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 5px;
  margin-top: 5px;
  color: white;
  transition: 0.2s;
  &:focus {
    border: solid 2px var(--primary-color);
  }
}
</style>
