<template>
  <div class="color-scheme">
    <div class="box">
      <div class="title">{{ $t("settings.interface.navigation-bar") }}</div>
      <CheckBox name="Show Settings" v-model="showSettings" />
      <CustomDropDown
        title="Font"
        :defaultId="selectedFont"
        :items="fonts"
        IdPath="id"
        @change="onFontChange"
      />
      <div class="title">{{ $t("settings.interface.time-format") }}</div>
      <RadioBox :items="['24-hour', '12-hour']" v-model="timeFormat" />
      <div class="title">{{ $t("settings.interface.colors") }}</div>
      <div class="hidden picker-button" ref="pickerButton">
        <div class="pickr"></div>
      </div>
      <div
        class="color-input"
        @click="showPicker(css, $event)"
        v-for="css in cssVarList"
        :key="css.key"
      >
        <div
          class="material-icons revert-icon"
          @click="revertButton(css, $event)"
          title="Revert"
        >
          replay
        </div>
        <div class="color-box" :style="{ background: `var(${css.key})` }" />
        <div class="name">{{ css.name }}</div>
      </div>
    </div>
    <div class="box">
      <div class="title">{{ $t("settings.interface.predefined-themes") }}</div>
      <div class="themes-list">
        <div class="theme default" @click="resetButton">
          {{ $t("settings.interface.default-theme") }}
        </div>
        <div class="theme" @click="applyTheme('halloween')">
          {{ $t("settings.interface.halloween-2020") }}
        </div>
        <div class="theme amoled" @click="applyTheme('amoled')">
          {{ $t("settings.interface.amoled-dark") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "@simonwep/pickr/dist/themes/classic.min.css";
import Pickr from "@simonwep/pickr";
import RadioBox from "@/components/RadioBox.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import CheckBox from "@/components/CheckBox.vue";
import fonts from "@/utils/fonts.json";
import { ReactiveLocalStorageModule } from "@/store/modules/reactiveLocalStorage";
import { applyFont } from "@/utils/applyFont";
import {
  getAllCssVars,
  getCustomCssVars,
  changeCssVar,
  applyDefaultTheme,
  applyDefaultValue,
} from "@/utils/customCssVars";

import { defineComponent } from "vue";
export default defineComponent({
  name: "InterfaceVariables",
  components: { RadioBox, CustomDropDown, CheckBox },
  data() {
    return {
      pickr: null as Pickr | null,
      lastClicked: {} as { key?: string; value?: string; custom?: string },
      customVars: getCustomCssVars(),
      timeFormat: parseInt(localStorage["timeFormat"] || "0"),
      fonts: Object.values(fonts),
      selectedFont: localStorage["font"] || Object.values(fonts)[0].id,
    };
  },
  computed: {
    showSettings: {
      get(): boolean {
        return ReactiveLocalStorageModule.getStore("showSettingsInNavigation");
      },
      set(value: boolean) {
        ReactiveLocalStorageModule.setStore({
          key: "showSettingsInNavigation",
          value,
        });
      },
    },
    cssVarList(): any {
      return getAllCssVars()
        .filter((item) => item.key.endsWith("color"))
        .map((item) => {
          const key = item.key.replace(/-/g, " ");
          return { ...item, name: key, custom: this.customVars[item.key] };
        });
    },
  },
  watch: {
    timeFormat: {
      handler: "onTimeFormatChagne",
    },
  },
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
          cancel: true,
        },
      },
    });
    this.pickr.on("hide", this.colorChanged);
  },
  beforeUnmount() {
    this.pickr?.off("hide", this.colorChanged);
    this.pickr?.destroyAndRemove();
  },
  methods: {
    onFontChange(id: string) {
      applyFont(id);
    },
    onTimeFormatChagne() {
      localStorage["timeFormat"] = this.timeFormat;
    },
    showPicker(css: any, event: any) {
      this.customVars = getCustomCssVars();
      if (event.target.closest(".revert-icon")) return;
      const rect = event.target.getBoundingClientRect();
      const top = rect.top - 100;
      (this.$refs.pickerButton as HTMLElement).style.top = top + "px";
      this.lastClicked = css;
      this.pickr?.setColor(css.custom || css.value);
      this.pickr?.show();
    },
    revertButton(css: any, event: any) {
      applyDefaultValue(css.key);
    },
    colorChanged(event: any) {
      if (!this.lastClicked.key) return;
      const hex = event.getColor().toHEXA().toString();
      changeCssVar(this.lastClicked?.key, hex);
      this.customVars = getCustomCssVars();
    },
    resetButton() {
      applyDefaultTheme(true);
    },
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
    },
  },
});
</script>

<style lang="scss" scoped>
.color-scheme {
  display: flex;
  flex-direction: column;
  overflow: auto;
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
  margin-left: 0;
  &:hover {
    .name {
      opacity: 1;
    }
  }
}
.title {
  font-weight: bold;
}
.revert-icon {
  margin-right: 5px;
  opacity: 0.2;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
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
    &.default {
      background: #368dff;
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
