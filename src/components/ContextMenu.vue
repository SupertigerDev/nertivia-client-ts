<template>
  <div
    class="context"
    :style="clampPos"
    v-click-outside="clickOutside"
    @contextmenu.prevent
  >
    <div class="content">
      <div
        class="item-container"
        v-for="(item, i) in itemsWithExtras"
        :class="{ disabled: item.disabled }"
        @click="itemClicked(item)"
        @mouseenter="itemHover(item, $event)"
        :key="i"
      >
        <div
          :class="{
            seperator: item.type === 'seperator',
            item: !item.type,
            warn: item.warn,
          }"
        >
          <div
            class="icon material-icons"
            :style="{ fontSize: item.iconSize }"
            v-if="item.icon && !item.type"
          >
            {{ item.icon }}
          </div>
          <div
            class="dot"
            v-if="type === 'dot' && item.color"
            :style="{ background: item.color }"
          />
          <div class="name" v-if="!item.type">{{ item.name }}</div>
          <div v-if="item.nestContext" class="icon material-icons">
            navigate_next
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useWindowProperties } from "@/utils/windowProperties";
import { PropType } from "vue";

interface ItemsProp {
  name?: string;
  color?: string;
  type?: string;
  id?: string;
  icon?: string;
  iconSize?: string;
  warn?: string;
  disabled?: boolean;
  nestContext?: string;
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "ContextMenu",
  props: {
    pos: {
      type: Object as PropType<{ x?: number; y?: number }>,
      required: true,
    },
    element: {
      type: HTMLElement,
      required: false,
    },
    items: {
      type: Array as PropType<ItemsProp[]>,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      height: 0,
      width: 0,
      mount: false,
      selection: window.getSelection(),
      currentHoveringItem: null as any,
    };
  },
  computed: {
    itemsWithExtras(): any {
      if (!this.element) return this.items;
      const clickedElementSelected =
        this.selection?.toString().length &&
        this.selection.containsNode(this.element, true);

      if (!clickedElementSelected) return this.items;
      const seperator: ItemsProp = {
        type: "seperator",
      };
      const copyItem: ItemsProp = {
        id: "_copy",
        name: "Copy",
        icon: "content_copy",
      };
      return [copyItem, seperator, ...this.items];
    },
    clampPos(): any {
      const top = this.pos.y || 0;
      const left = this.pos.x || 0;

      // prevent from going bottom of the screen
      const heightPos = this.height + top;
      const clampedTop =
        this.clamp(heightPos, 0, this.windowDiamentions.height) - this.height;
      // prevent from going right of the screen
      const widthPos = this.width + left;
      const clampedLeft =
        this.clamp(widthPos, 0, this.windowDiamentions.width) - this.width;

      return {
        top: clampedTop + "px",
        left: clampedLeft + "px",
      };
    },
    windowDiamentions(): any {
      const { resizeHeight, resizeWidth } = useWindowProperties();
      return {
        height: resizeHeight,
        width: resizeWidth,
      };
    },
  },
  mounted() {
    window.setTimeout(() => {
      this.mount = true;
    }, 10);
    this.height = this.$el.clientHeight;
    this.width = this.$el.clientWidth;
  },
  methods: {
    clickOutside(event: any) {
      if (!this.mount) return;
      if (event.target.closest(".context")) return;
      this.$emit("close");
    },
    itemClicked(item: ItemsProp) {
      if (item.type === "seperator") return;
      if (item.disabled) return;
      this.$emit("itemClick", item);
      if (item.nestContext) return;
      this.$emit("close");

      if (item.id === "_copy") {
        document.execCommand("copy");
      }
    },
    itemHover(item: any, event: any) {
      this.currentHoveringItem = item;
      window.setTimeout(() => {
        if (item.id !== this.currentHoveringItem?.id) return;
        if (item.type === "seperator") return;
        this.$emit("itemHover", {
          item,
          target: event.target.closest(".content"),
        });
      }, 200);
    },
    clamp(num: number, min: number, max: number) {
      return num <= min ? min : num >= max ? max : num;
    },
  },
});
</script>

<style scoped></style>

<style lang="scss" scoped>
.context {
  pointer-events: all;
  background: var(--context-menu-bg-color);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 8px;
  overflow: hidden;
  z-index: 99999999999;
}
.content {
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
  gap: 5px;
  padding: 5px;
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
.item {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  padding: 8px;
  padding-top: 5px;
  border-radius: 4px;
  padding-bottom: 5px;
  display: flex;
  align-content: center;
  align-items: center;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 21px;
    height: 21px;
    transition: 0.2s;
    font-size: 21px;
    color: white;
  }
  &:hover {
    background: var(--primary-color);
    color: white;
  }
  &:active {
    transform: scale(0.9);
  }
  &.warn {
    color: var(--alert-color);
    .icon {
      color: var(--alert-color);
    }
    &:hover {
      background: var(--alert-color);
      color: white;
      .icon {
        color: white;
      }
    }
  }
}
.disabled {
  opacity: 0.4;
  .item {
    pointer-events: none;
  }
}
.name {
  margin-left: 5px;
  flex: 1;
}
.seperator {
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: rgba(255, 255, 255, 0.075);
  margin-top: 2px;
  margin-bottom: 2px;
}

.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
