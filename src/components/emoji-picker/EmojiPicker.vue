<script>
import EmojiTemplate from "./EmojiTemplate";
import Preview from "./Preview";
import VirtualList from "vue-virtual-scroll-list";
import Tabs from "./Tabs";
import { addRecentEmoji, getRecentEmojis } from "@/utils/recentEmojiManager";
import emojiParser from "@/utils/emojiParser";
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import { insert } from "text-field-edit";
export default {
  props: ["inputElement"],
  components: { VirtualList, EmojiTemplate, Tabs, Preview },
  data() {
    return {
      emojiWithGroup: [],
      allRecentEmojis: [],
      allCustomEmojis: [],
      allSearchEmojis: [],
      hoveredEmoji: null,
      search: ""
    };
  },

  render() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const input = (
      <input
        type="text"
        class="input"
        ref="search"
        placeholder="Search"
        domProps={{ value: this.search }}
        on={{
          input: function(event) {
            self.search = event.target.value;
          }
        }}
      />
    );

    const category = name => <div class="category">{name}</div>;

    const emojiRow = arr => (
      <div class="emoji-row">
        <div class="wrapper">
          {arr.map(e => (
            <EmojiTemplate
              key={e.id}
              emoji={e}
              nativeOn={{
                click: () => this.emojiClick(e),
                mouseover: () => this.onEmojiHover(e)
              }}
            />
          ))}
        </div>
      </div>
    );

    const mapEmojis = arr => arr.map(row => emojiRow(row));

    const block = (name, arr, addButton) => {
      const components = [category(name), mapEmojis(arr)];
      if (addButton && !this.customEmojis.length) {
        components.push(
          <EmojiTemplate
            addEmojiButton={true}
            nativeOn={{
              click: () => this.emojiClick(null, true),
              mouseover: () => this.onEmojiHover(null, true)
            }}
          />
        );
      }
      return components;
    };

    const defaultEmojis = this.emojiWithGroup.map((g, i) => {
      if (g.gname) {
        return (
          <div class="category">
            <div class="name">{g.gname}</div>
          </div>
        );
      }
      return <div key={g.gname + i.toString()}>{emojiRow(g || [])}</div>;
    });

    const showRecents = !this.search.trim() && this.allRecentEmojis.length;
    const showCustom = !this.search.trim();
    const showDefault = !this.search.trim();
    const showSearch = this.search.trim();

    const emojisList = (
      <div class="emojis-list">
        <VirtualList size={37} remain={11} ref="virtualList">
          {[
            !!showRecents && block("Recents", this.allRecentEmojis),
            !!showCustom && block("Custom Emojis", this.allCustomEmojis, true),
            !!showDefault && defaultEmojis,
            !!showSearch && block("Results", this.allSearchEmojis)
          ]}
        </VirtualList>
      </div>
    );

    return (
      <div v-click-outside="backgroundClick" class="emoji-panel">
        <div class="emoji-panel-inner">
          <Tabs onClick={this.tabClicked} />
          {input}
          {emojisList}
          <Preview hoveredEmoji={this.hoveredEmoji} />
        </div>
      </div>
    );
  },

  mounted() {
    if (!this.$isMobile) {
      this.$refs.search.focus();
    }
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
    close() {
      this.$emit("close");
    },
    backgroundClick(event) {
      if (!event.target.closest(".emoji-button")) this.close();
    },
    onEmojiHover(em, addButton) {
      if (addButton) {
        this.hoveredEmoji = {
          annotation: "Add Custom Emojis!",
          addButton: true
        };
        return;
      }
      this.hoveredEmoji = {
        ...em,
        el: em.unicode && emojiParser.replaceEmojis(em.unicode)
      };
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
        const emoji = {
          ...emojis[index],
          id: index + Math.floor(Math.random() * 12202222222)
        };

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
    emojiClick(emoji, addButton) {
      if (addButton) {
        this.$router.push("/app/settings/manage-emojis");
        return;
      }
      const id = emoji.name || emoji.shortcodes[0];
      addRecentEmoji(id);
      if (!this.inputElement) {
        this.$emit("click", emoji);
        return;
      }
      insert(this.inputElement, `:${id}: `);
      this.inputElement.focus();
      this.close();
    },
    tabClicked(index) {
      const ROW_SIZE = 37;
      let recentRows = this.allRecentEmojis.length + 1;
      let customEmojiRows = this.allCustomEmojis.length + 1;
      if (!this.allRecentEmojis.length) recentRows = 0;
      if (!this.allCustomEmojis.length) customEmojiRows = 2;
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
      this.$refs.virtualList.setScrollTop(
        (recentRows + customEmojiRows + rowIndex) * ROW_SIZE - ROW_SIZE
      );
    },
    findGroupEmojiPos(unicode) {
      return emojiParser.allEmojis.find(e => e.unicode === unicode)?.pos;
    }
  },
  watch: {
    search(val) {
      this.$refs.virtualList.forceRender();
      const trimmed = val.trim();
      if (!trimmed.length) {
        return;
      }
      const search = trimmed
        .replaceAll("_", "")
        .replaceAll(" ", "")
        .replaceAll(":", "")
        .toLowerCase();

      const filterCustomEmoji = this.customEmojis.filter(e => {
        return e.name
          .replaceAll("_", "")
          .toLowerCase()
          .includes(search);
      });

      const filterEmoji = emojiParser.allEmojis.filter(e => {
        const name = e.shortcodes
          .join("")
          .replaceAll("_", "")
          .toLowerCase();
        return name.includes(search);
      });
      this.allSearchEmojis = this.arrToRows([
        ...filterCustomEmoji,
        ...filterEmoji
      ]);
    }
  },
  computed: {
    recentEmojis() {
      return getRecentEmojis();
    },
    customEmojis() {
      return CustomEmojisModule.customEmojis;
    }
  }
};
</script>

<style scoped lang="scss">
.emoji-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 111111111111111;
}

.emoji-panel-inner {
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  z-index: 99999;
  height: 352px;
  width: 375px;
  overflow: hidden;
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  color: rgba(255, 255, 255, 0.6);
  padding-left: 5px;
  align-items: center;
  align-content: center;
}
.emoji-row .wrapper {
  height: 37px;
  display: flex;
  flex-direction: row;
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
