<!-- eslint-disable vue/valid-v-model -->
<template>
  <div class="editor" v-if="theme">
    <div class="menu-strip">
      <CustomButton
        v-if="!isPopout"
        icon="navigate_before"
        class="back-button"
        @click="$emit('back')"
      />
      <input type="text" v-model="name" placeholder="Theme Name" />
      <CustomButton
        v-if="showSaveButton"
        name="Save & Apply"
        @click="saveAndApplyButton"
        icon="done"
        :valid="true"
      />
      <CustomButton
        v-else-if="applied"
        name="Unapply"
        @click="unapply"
        icon="close"
        :alert="true"
      />
      <CustomButton
        v-else
        name="Apply"
        @click="apply"
        icon="done"
        :valid="true"
      />
      <CustomButton
        v-if="!isPopout && !$isMobile"
        name="Detach"
        @click="detech"
        icon="fullscreen"
      />
    </div>
    <codemirror
      v-model:value="css"
      :options="cmOptions"
      @ready="onCodemirrorReady"
    />
  </div>
</template>

<script lang="ts">
import { getTheme, Theme, updateTheme } from "@/services/themeService";
import { applyTheme, unapplyTheme } from "@/utils/CSSTheme";
import CustomButton from "@/components/CustomButton.vue";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/css-hint";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/css/css.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";

import { defineComponent } from "vue";
export default defineComponent({
  name: "Editor",
  components: { Codemirror, CustomButton },
  props: {
    themeID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      applied: localStorage["themeID"] === this.themeID,
      theme: null as Theme | null,
      isPopout: false,
      popupWindow: null as Window | null,
      css: "",
      name: "",
      cmOptions: {
        tabSize: 2,
        mode: "text/css",
        lineNumbers: true,
        theme: "ayu-mirage",
        line: true,
      },
    };
  },
  computed: {
    showSaveButton(): any {
      if (!this.theme) return false;
      if (this.theme.client_version !== this.$lastUIBreakingVersion)
        return true;
      if (this.name !== this.theme.name) return true;
      if (this.css !== this.theme.css) return true;
      return false;
    },
  },
  async mounted() {
    const w = window as any;
    if (w.editor_theme) {
      this.isPopout = true;
      this.theme = w.editor_theme;
      this.css = w.css;
      this.name = w.name;
      this.applied = localStorage["themeID"] === this.theme?.id;
      return;
    }
    this.theme = await getTheme(this.themeID);
    this.css = this.theme.css;
    this.name = this.theme.name;
  },
  methods: {
    onCodemirrorReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
    async saveAndApplyButton() {
      await this.save();
      await this.apply();
    },
    async save() {
      if (!this.theme) return;
      return updateTheme(this.theme?.id, {
        css: this.css,
        name: this.name,
        client_version: this.$lastUIBreakingVersion,
      }).then(() => {
        if (!this.theme) return;
        this.theme.css = this.css;
        this.theme.name = this.name;
        this.theme.client_version = this.$lastUIBreakingVersion;
      });
    },
    async apply() {
      await applyTheme(this.themeID, this.css);
      this.applied = true;
      if (this.isPopout) {
        this.$window.postMessage(
          { action: "UpdateAndApply", css: this.css, name: this.name },
          process.env.VUE_APP_MAIN_APP_URL || ""
        );
      }
    },
    unapply() {
      unapplyTheme();
      this.applied = false;
      if (this.isPopout) {
        this.$window.postMessage(
          { action: "unapplyTheme" },
          process.env.VUE_APP_MAIN_APP_URL || ""
        );
      }
    },
    detech() {
      if (this.$isElectron) {
        alert("Open Nertivia in a browser to detach.");
        return;
      }
      this.popupWindow = this.$window.open(
        "/popout-css-editor",
        "popUpWindow",
        "height=400, width=650"
      );
      if (!this.popupWindow) return;
      (this.popupWindow as any).editor_theme = this.theme;
      (this.popupWindow as any).css = this.css;
      (this.popupWindow as any).name = this.name;
      this.popupWindow.onbeforeunload = () => {
        console.log("closed");
      };
      this.popupWindow.addEventListener("message", (event) => {
        const data = event.data;
        if (data.action === "UpdateAndApply") {
          if (!this.theme) return;
          this.css = data.css;
          this.name = data.name;
          this.theme.css = data.css;
          this.theme.name = data.name;
          this.theme.client_version = this.$lastUIBreakingVersion;
          this.apply();
          return;
        }
        if (data.action === "unapplyTheme") {
          this.unapply();
          return;
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.menu-strip {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  .back-button {
    margin-right: 0;
  }
  input {
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    background: rgba(255, 255, 255, 0.1);
    padding: 5px;
    height: 30px;
    border-radius: 4px;
    color: white;
    outline: none;
    border: none;
    max-width: 200px;
    width: 100%;
  }
}
</style>
<style>
.editor .codemirror-container {
  flex: 1;
  overflow: hidden;
}
.editor .codemirror-container {
  height: 100%;
}
.editor .cm-s-ayu-mirage {
  height: 100%;
}
</style>
