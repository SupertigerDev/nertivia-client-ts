<template>
  <div class="interface">
    <div class="description">
      <div class="material-icons">info</div>
      Change the appearance of Nertivia.
    </div>
    <div class="box">
      <div class="title">Colors</div>
      <div class="hidden picker-button" ref="pickerButton">
        <div class="pickr"></div>
      </div>
      <div
        class="color-input"
        @click="showPicker(css, $event)"
        v-for="css in cssVarList"
        :key="css.key"
      >
        <div class="color-box" :style="{ background: `var(${css.key})` }" />
        <div class="name">{{ css.name }}</div>
      </div>
      <div class="reset" @click="resetButton">
        Reset All Colors
      </div>
    </div>
    <div class="box">
      <div class="title">Event Themes</div>
      <div class="themes-list">
        <div class="theme amoled" @click="applyTheme('amoled')">
          Apply AMOLED Dark
        </div>
        <div class="theme" @click="applyTheme('halloween')">
          Apply Halloween Theme 2020
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "@simonwep/pickr/dist/themes/classic.min.css";
import { Component, Vue } from "vue-property-decorator";
import Pickr from "@simonwep/pickr";
import {
  getAllCssVars,
  getCustomCssVars,
  changeCssVar,
  removeCustomCssVars,
  applyDefaultTheme
} from "@/utils/customCssVars";
@Component
export default class MainApp extends Vue {
  pickr: Pickr | null = null;
  lastClicked: { key?: string; value?: string; custom?: string } = {};
  customVars = getCustomCssVars();
  mounted() {
    this.pickr = Pickr.create({
      el: ".pickr",
      theme: "classic",
      components: {
        preview: true,
        opacity: true,
        hue: true,
        palette: true,
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          cancel: true
        }
      }
    });
    this.pickr.on("hide", this.colorChanged);
  }
  beforeDestroy() {
    this.pickr?.off("hide", this.colorChanged);
    this.pickr?.destroyAndRemove();
  }
  showPicker(css: any, event: any) {
    const rect = event.target.getBoundingClientRect();
    const top = rect.top - 47;
    (this.$refs.pickerButton as HTMLElement).style.top = top + "px";
    this.lastClicked = css;
    this.pickr?.setColor(css.custom || css.value);
    this.pickr?.show();
  }
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
    const hex = event
      .getColor()
      .toHEXA()
      .toString();
    changeCssVar(this.lastClicked?.key, hex);
    this.customVars = getCustomCssVars();
  }
  resetButton() {
    applyDefaultTheme(true);
  }
  applyTheme(theme: string) {
    if (theme === "halloween") {
      applyDefaultTheme(true);
      changeCssVar("--primary-color", "#ff4c1f");
      changeCssVar("--main-header-bg-color", "#ff4c1f");
      changeCssVar("--side-header-bg-color", "#ff4c1fcb");
      changeCssVar("--my-chat-bubble-color", "#171725");
    }
    if (theme === "amoled") {
      applyDefaultTheme(true);
      // changeCssVar("--primary-color", "#ff801f");
      changeCssVar("--background-color", "black");
      changeCssVar("--drawer-bg-color", "#0e0e0e");
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
  position: relative;
  flex-direction: column;
}
.description {
  margin: 10px;
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
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
  opacity: 0;
  pointer-events: none;
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
    background: #ff4c1f;
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
.picker-button {
  position: absolute;
  left: 10px;
}
</style>

<style lang="scss">
.pcr-app {
  z-index: 99999999999 !important;
  background: #1a1a1de8;
  border-radius: 4px;
}
.pcr-palette::before {
  background: white !important;
}
.pcr-color-preview::before {
  background: white !important;
}
</style>
