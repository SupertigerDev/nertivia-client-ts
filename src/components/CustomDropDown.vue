<template>
  <div class="input">
    <fieldset
      class="content"
      :class="{ focused: selectedItem, error, valid: validMessage }"
    >
      <legend class="title">{{ title }}</legend>
      <div class="container" @click="openDropDown = !openDropDown">
        <div class="selected-preview">
          <AvatarImage
            class="avatar"
            v-if="selectedItem && selectedItem.avatar"
            :seedId="selectedItem.avatar.seedID"
            :imageId="selectedItem.avatar.imageID"
            size="20px"
          />
          {{ selectedItem ? selectedItem[namePath] : defaultText }}
          <div class="note" v-if="selectedItem">
            {{ selectedItem.note }}
          </div>
        </div>
        <div class="material-icons icon">keyboard_arrow_down</div>
      </div>
      <div class="dropdown" v-if="openDropDown" v-click-outside="clickOutside">
        <div class="dropdown-content">
          <div
            class="item"
            :class="{
              selected: selectedId !== null && item[IdPath] === selectedId,
            }"
            @click="itemClick(item[IdPath])"
            v-for="(item, i) in items"
            :key="i"
          >
            <AvatarImage
              class="avatar"
              v-if="item.avatar"
              :seedId="item.avatar.seedID"
              :imageId="item.avatar.imageID"
              size="20px"
            />
            {{ item[namePath] }}
            <div class="note" v-if="item.note">{{ item.note }}</div>
          </div>
        </div>
      </div>
    </fieldset>

    <div class="error-message" v-if="!validMessage">{{ error }}</div>
    <div class="valid-message" v-if="!error && validMessage">
      {{ validMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { PropType } from "vue";

interface Item {
  name: string;
  note: string;
  avatar?: {
    seedID: string;
    imageID: string;
  };
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "CustomDropDown",
  components: { AvatarImage },
  emits: ["change"],
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<(Item | any)[]>,
      required: true,
    },
    error: {
      type: String,
      required: false,
    },
    defaultId: {
      type: [Number, String],
      default: null,
    },
    namePath: {
      type: String,
      default: "name",
    },
    validMessage: {
      type: String,
      required: false,
    },
    IdPath: {
      type: String,
      required: true,
    },
    defaultText: {
      type: String,
      default: "Select Item",
    },
  },
  data() {
    return {
      focused: true,
      openDropDown: false,
      selectedId: this.defaultId,
    };
  },
  computed: {
    selectedItem(): any {
      if (this.selectedId === null) return undefined;
      return this.items.find((i) => i[this.IdPath] === this.selectedId);
    },
  },
  methods: {
    clickOutside() {
      this.openDropDown = false;
    },
    itemClick(id: number) {
      this.openDropDown = false;
      this.selectedId = id;
      this.$emit("change", id);
    },
  },
});
</script>

<style lang="scss" scoped>
.input {
  flex-shrink: 0;
  user-select: none;
}
.input .content {
  border-radius: 8px;
  border: solid 2px rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    .icon {
      opacity: 1;
    }
  }

  &.focused {
    border: solid 2px var(--primary-color);
  }
  &.error {
    border: solid 2px var(--alert-color);
  }
  &.valid {
    border: solid 2px var(--success-color);
  }
}
.title {
  opacity: 0.8;
  font-size: 14px;
}
.note {
  margin-left: auto;
  opacity: 0.4;
  font-size: 14px;
}
.selected-preview {
  border: none;
  color: white;
  display: inline-block;
  outline: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  flex: 1;
}

.error-message {
  color: var(--alert-color);
  margin-top: 2px;
  min-height: 21px;
  margin-left: 5px;
  font-size: 12px;
}
.valid-message {
  color: var(--success-color);
  margin-top: 2px;
  min-height: 21px;
  margin-left: 5px;
  font-size: 12px;
}
.container {
  display: flex;
  cursor: pointer;
  position: relative;
}
.icon {
  opacity: 0.7;
  user-select: none;
  transition: 0.2s;
}
.dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -2px;
  right: -2px;
  top: 47px;
  background: var(--context-menu-bg-color);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
  z-index: 111111111;

  border-radius: 8px;
  .dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    opacity: 0;
    animation: showUp 0.2s;
    animation-fill-mode: forwards;
  }
  .item {
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    padding: 8px;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    align-content: center;
    align-items: center;
    border-radius: 4px;
    .icon {
      transition: 0.2s;
      font-size: 21px;
      color: white;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    &.selected {
      background: var(--primary-color);
      color: white;
    }

    &:active {
      transform: scale(0.9);
    }
  }
}
.avatar {
  margin-right: 5px;
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
</style>
