<template>
  <div class="tabs" @mouseleave="tabLeave">
    <div
      class="tab"
      v-if="recentEmojis.length"
      @click="tabClicked('RECENTS')"
      @mouseenter="tabsHover($event, 0)"
    >
      <i class="material-icons">history</i>
    </div>
    <div
      class="tab"
      @click="tabClicked('CUSTOM')"
      @mouseenter="tabsHover($event, 1)"
    >
      <i class="material-icons">face</i>
    </div>
    <div
      class="tab"
      v-for="(e, i) in categories"
      :key="i"
      @click="tabClicked(i)"
      @mouseenter="tabsHover($event, i + 2)"
    >
      <div
        class="tab-emoji"
        :style="{ backgroundPosition: findGroupEmojiPos(e) }"
      />
    </div>
    <div
      class="tool-tip"
      :class="{ hidden: !tabShown }"
      ref="toolTip"
      :style="{ left: tabLeftPos || 0 }"
    >
      Recents
    </div>
  </div>
</template>

<script lang="ts">
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import emojiParser from "@/utils/emojiParser";
import { getRecentEmojis } from "@/utils/recentEmojiManager";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Tabs",
  emits: ["click"],

  props: {
    pos: {
      type: Object as PropType<{ x?: number; y?: number }>,
      required: false,
    },
  },
  data() {
    return {
      categories: ["😀", "🐱", "🍎", "🏀", "🚗", "⌚️", "❤️", "🏁"],
      tabLeftPos: null as string | null,
      tabShown: false,
    };
  },
  computed: {
    recentEmojis(): any {
      return getRecentEmojis();
    },
    customEmojis(): any {
      return CustomEmojisModule.customEmojis;
    },
  },
  methods: {
    findGroupEmojiPos(unicode: string) {
      return emojiParser.allEmojis.find((e) => e.unicode === unicode)?.pos;
    },
    tabsHover(event: any, index: number) {
      const toolTip: any = this.$refs.toolTip;
      if (index == 0) {
        toolTip.innerHTML = "Recents";
      }
      if (index == 1) {
        toolTip.innerHTML = "Custom Emojis";
      }
      if (index > 1) {
        toolTip.innerHTML = (emojiParser.allGroups as any)[index - 2];
      }
      this.tabShown = true;
      const tabLeftPos = event.target.offsetLeft;
      const toolTipCenter = (this.$refs.toolTip as any).clientWidth / 2;
      this.tabLeftPos = tabLeftPos - toolTipCenter + 17 + "px";
    },
    tabClicked(i: number | string) {
      if (typeof i === "number") {
        this.$emit("click", (emojiParser.allGroups as any)[i]);
        return;
      }
      this.$emit("click", i);
    },
    tabLeave() {
      this.tabShown = false;
    },
  },
});
</script>

<style scoped></style>

<style lang="scss" scoped>
.tabs {
  height: 37px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}
.tab {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  user-select: none;
  height: 37px;
  width: 37px;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.1s;
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
.tab .tab-emoji {
  background-image: url("../../../assets/emojiSprites.png");
  background-position: 0px 0px;
  background-repeat: no-repeat;
  background-size: 1000px;
  height: 25px;
  width: 25px;
}
.tool-tip {
  position: absolute;
  border-radius: 4px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  top: 40px;
  left: 0;
  z-index: 999333111;
  color: white;
  user-select: none;
  transition: 0.2s;
  font-size: 14px;
  pointer-events: none;
}
.hidden {
  visibility: hidden;
}
</style>
