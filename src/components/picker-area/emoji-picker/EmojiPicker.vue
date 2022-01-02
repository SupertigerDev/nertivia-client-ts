<script lang="tsx">
import EmojiTemplate from "./EmojiTemplate.vue";
import Preview from "./Preview.vue";
import VirtualList from "@supertiger/vue-3-virtual-scroll-list";
import Tabs from "./Tabs.vue";
import { addRecentEmoji, getRecentEmojis } from "@/utils/recentEmojiManager";
import emojiParser from "@/utils/emojiParser";
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import { insert } from "text-field-edit";
import { computed, defineComponent, h } from "vue";

export default defineComponent({
  props: ["inputElement"],
  emits: ["click", "close"],
  components: { EmojiTemplate, Tabs, Preview },
  data() {
    return {
      emojiWithGroup: [],
      allRecentEmojis: [],
      allCustomEmojis: [],
      allSearchEmojis: [],
      hoveredEmoji: null as any,
      search: "",
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
        value={this.search}
        onInput={(event: any) => {
          self.search = event?.target?.value;
        }}
      />
    );

    const category = (name) => (
      <div class="category" style={{ height: "37px" }}>
        {name}
      </div>
    );

    const emojiRow = (arr) => (
      <div class="emoji-row" style={{ height: "37px" }}>
        <div class="wrapper">
          {arr.map((e) =>
            h(EmojiTemplate, {
              key: e.id,
              emoji: e,
              onClick: () => this.emojiClick(e),
              onMouseover: () => this.onEmojiHover(e),
            })
          )}
        </div>
      </div>
    );

    const mapEmojis = (arr) => arr.map((row) => emojiRow(row));

    const block = (name, arr, addButton?) => {
      const components = [category(name), ...mapEmojis(arr)];
      if (addButton && !this.customEmojis.length) {
        components.push(
          h(EmojiTemplate, {
            addEmojiButton: true,
            onClick: () => this.emojiClick(null, true),
            onMouseover: () => this.onEmojiHover(null, true),
          })
        );
      }
      return components;
    };

    const defaultEmojis = () =>
      this.emojiWithGroup.map((g: any, i) => {
        if (g.gname) {
          return (
            <div class="category" style={{ height: "37px" }}>
              <div class="name">{g.gname}</div>
            </div>
          );
        }
        return (
          <div key={g.gname + i.toString()} style={{ height: "37px" }}>
            {emojiRow(g || [])}
          </div>
        );
      });

    const items = computed(() => {
      const showRecents = !this.search.trim() && this.allRecentEmojis.length;
      const showCustom = !this.search.trim();
      const showDefault = !this.search.trim();
      const showSearch = this.search.trim();
      let items: any = [];

      if (showRecents)
        items = [...items, ...block("Recents", this.allRecentEmojis)];
      if (showCustom)
        items = [
          ...items,
          ...block("Custom Emojis", this.allCustomEmojis, true),
        ];
      if (showDefault) items = [...items, defaultEmojis()];
      if (showSearch)
        items = [...items, ...block("Results", this.allSearchEmojis)];
      return items;
    });

    const emojisList = (
      <div class="emojis-list">
        <VirtualList
          key={this.customEmojis.length}
          size={37}
          remain={11}
          variable={true}
          ref="virtualList"
        >
          {...items.value}
        </VirtualList>
      </div>
    );

    return (
      <div class="emoji-panel">
        {h(Tabs as any, { onClick: this.tabClicked })}
        {input}
        {emojisList}
        {this.hoveredEmoji && <Preview hoveredEmoji={this.hoveredEmoji} />}
      </div>
    );
  },

  mounted() {
    if (!this.$isMobile) {
      (this.$refs.search as any).focus();
    }
    window.setTimeout(() => {
      const z = performance.now();
      this.allCustomEmojis = this.arrToRows(this.customEmojis);
      const o = performance.now();
      console.log("custom emojis took " + Math.round(o - z) + "ms to load.");
    });
    window.setTimeout(() => {
      const z = performance.now();
      this.allRecentEmojis = this.arrToRows(this.allRecentEmojisArr());
      const o = performance.now();
      console.log("recent emojis took " + Math.round(o - z) + "ms to load.");
    });
    window.setTimeout(() => {
      const z = performance.now();
      this.emojiWithGroup = this.emojisWithGroup();
      const o = performance.now();
      console.log("emojis took " + Math.round(o - z) + "ms to load.");
      (this.$refs.virtualList as any).forceRender();
    });
  },

  methods: {
    close() {
      this.$emit("close");
    },
    onEmojiHover(em, addButton?) {
      if (addButton) {
        this.hoveredEmoji = {
          annotation: "Add Custom Emojis!",
          addButton: true,
        };
        return;
      }
      this.hoveredEmoji = {
        ...em,
        el: em.unicode && emojiParser.replaceEmojis(em.unicode),
      };
    },
    emojisWithGroup() {
      const emojis = emojiParser.allEmojis;
      const groups = emojiParser.allGroups;
      const emojisWithGroups: any = [];
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
      const emojis: any = [];
      for (let index = 0; index < this.recentEmojis.length; index++) {
        const shortcode = this.recentEmojis[index];

        const emoji = emojiParser.allEmojis.find(
          (e) => e.shortcodes[0] === shortcode
        );

        if (!emoji) {
          const cusEmoji = this.customEmojis.find(
            (emoji) => emoji.name === shortcode
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
      const newArr: any = [];
      for (let index = 0; index < emojis.length; index++) {
        let emoji = {
          ...emojis[index],
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
    emojiClick(emoji, addButton?) {
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
      const virtualList = this.$refs.virtualList as any;
      const ROW_SIZE = 37;
      let recentRows = this.allRecentEmojis.length;
      let customEmojiRows = this.allCustomEmojis.length;
      if (customEmojiRows) customEmojiRows++;
      if (recentRows) recentRows++;

      if (index === "RECENTS") {
        virtualList.setScrollTop(0);
        return;
      }
      if (index === "CUSTOM") {
        virtualList.setScrollTop(recentRows * ROW_SIZE);
        return;
      }

      const rowIndex = this.emojiWithGroup.findIndex(
        (r: any) => r.gname === index
      );
      virtualList.setScrollTop(
        (recentRows + customEmojiRows + rowIndex) * ROW_SIZE
      );
    },
    findGroupEmojiPos(unicode) {
      return emojiParser.allEmojis.find((e) => e.unicode === unicode)?.pos;
    },
  },
  watch: {
    search(val) {
      (this.$refs.virtualList as any).forceRender();
      const trimmed = val.trim();
      if (!trimmed.length) {
        return;
      }
      const search = trimmed
        .replaceAll("_", "")
        .replaceAll(" ", "")
        .replaceAll(":", "")
        .toLowerCase();

      const filterCustomEmoji = this.customEmojis.filter((e) => {
        return e.name.replaceAll("_", "").toLowerCase().includes(search);
      });

      const filterEmoji = emojiParser.allEmojis.filter((e) => {
        const name = e.shortcodes.join("").replaceAll("_", "").toLowerCase();
        return name.includes(search);
      });
      this.allSearchEmojis = this.arrToRows([
        ...filterCustomEmoji,
        ...filterEmoji,
      ]);
    },
    customEmojis() {
      this.allCustomEmojis = this.arrToRows(this.customEmojis);
    },
  },
  computed: {
    recentEmojis(): any {
      return getRecentEmojis();
    },
    customEmojis(): any {
      return CustomEmojisModule.customEmojis;
    },
  },
});
</script>

<style scoped lang="scss">
.emoji-panel {
  display: flex;
  flex-direction: column;
  transition: 0.3s;
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
