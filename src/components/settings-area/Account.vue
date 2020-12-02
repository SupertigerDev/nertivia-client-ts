<template>
  <div class="interface">
    <div class="description">WIP</div>
    <div class="box"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getAllCssVars,
  getCustomCssVars,
  changeCssVar,
  removeCustomCssVars
} from "@/utils/customCssVars";
@Component
export default class MainApp extends Vue {
  lastClicked: { key?: string; value?: string; custom?: string } = {};
  customVars = getCustomCssVars();
  get cssVarList() {
    return getAllCssVars()
      .filter(item => item.key.endsWith("color"))
      .map(item => {
        const key = item.key.replace(/-/g, " ");
        return { ...item, name: key, custom: this.customVars[item.key] };
      });
  }
  colorChanged(event: any) {
    if (!this.lastClicked.key) return;
    changeCssVar(this.lastClicked?.key, event.target.value);
    this.customVars = getCustomCssVars();
    event.target.value = "owo";
  }
  resetButton() {
    removeCustomCssVars();
    location.reload();
  }
  applyTheme(theme: string) {
    if (theme === "halloween") {
      changeCssVar("--primary-color", "#ff801f");
      changeCssVar("--background-color", "#261d3e");
      changeCssVar("--drawer-bg-color", "#291d4e");
      changeCssVar("--main-header-bg-color", "#ff781f");
      changeCssVar("--side-header-bg-color", "#d55c0b");
      changeCssVar("--my-chat-bubble-color", "#e87b21");
      changeCssVar("--others-chat-bubble-color", "#433a50");
    }
    if (theme === "amoled") {
      // changeCssVar("--primary-color", "#ff801f");
      changeCssVar("--background-color", "black");
      // changeCssVar("--drawer-bg-color", "#291d4e");
      // changeCssVar("--main-header-bg-color", "#ff781f");
      // changeCssVar("--side-header-bg-color", "#d55c0b");
      // changeCssVar("--my-chat-bubble-color", "#e87b21");
      // changeCssVar("--others-chat-bubble-color", "#433a50");
    }
  }
}
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
}
.description {
  opacity: 0.7;
  margin: 5px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.name {
  text-transform: capitalize;
  opacity: 0.7;
  transition: 0.2s;
}
.color-input {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  align-content: center;
  margin: 5px;
  &:hover {
    .name {
      opacity: 1;
    }
  }
}
.title {
  font-weight: bold;
}
.color-box {
  height: 20px;
  width: 20px;
  background: var(--primary-color);
  margin-right: 6px;
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.4);
}
.hidden {
  display: none;
}
.reset {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  opacity: 0.8;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 15px;
  &:hover {
    opacity: 1;
  }
}
.themes-list {
  .theme {
    padding: 5px;
    display: flex;
    align-content: center;
    align-items: center;
    background: rgb(255, 126, 21);
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    transition: 0.2s;
    &:hover {
      opacity: 0.7;
    }
    &.amoled {
      background: black;
    }
  }
}
</style>
