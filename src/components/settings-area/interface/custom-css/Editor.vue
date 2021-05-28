<template>
  <div class="editor" v-if="theme">
    <div class="menu-strip">
      <CustomButton icon="navigate_before" @click="$emit('back')" />
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
    </div>
    <codemirror v-model="css" :options="cmOptions" @ready="onCodemirrorReady" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getTheme, Theme, updateTheme } from "@/services/themeService";
import { applyTheme, unapplyTheme } from "@/utils/CSSTheme";
import CustomButton from "@/components/CustomButton.vue";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/css-hint";

const { codemirror } = require("vue-codemirror");
import "codemirror/mode/css/css.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";

@Component({ components: { codemirror, CustomButton } })
export default class Editor extends Vue {
  @Prop() private themeID!: string;
  applied = localStorage["themeID"] === this.themeID;
  theme: Theme | null = null;
  css = "";
  name = "";
  cmOptions = {
    tabSize: 2,
    mode: "text/css",
    lineNumbers: true,
    theme: "ayu-mirage",
    line: true
  };
  onCodemirrorReady(cm) {
    cm.on("keypress", () => {
      cm.showHint({ completeSingle: false });
    });
  }
  async saveAndApplyButton() {
    await this.save();
    await this.apply();
  }
  async save() {
    return updateTheme(this.themeID, {
      css: this.css,
      name: this.name,
      client_version: this.$lastUIBreakingVersion
    }).then(() => {
      if (!this.theme) return;
      this.theme.css = this.css;
      this.theme.name = this.name;
      this.$set(this.theme, "client_version", this.$lastUIBreakingVersion);
    });
  }
  async apply() {
    await applyTheme(this.themeID, this.css);
    this.applied = true;
  }
  unapply() {
    unapplyTheme();
    this.applied = false;
  }
  async mounted() {
    this.theme = await getTheme(this.themeID);
    this.css = this.theme.css;
    this.name = this.theme.name;
  }
  get showSaveButton() {
    if (!this.theme) return false;
    if (this.theme.client_version !== this.$lastUIBreakingVersion) return true;
    if (this.name !== this.theme.name) return true;
    if (this.css !== this.theme.css) return true;
    return false;
  }
}
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.menu-strip {
  display: flex;
  flex-shrink: 0;
  align-items: center;

  input {
    margin-top: 5px;
    margin-bottom: 5px;
    background: rgba(255, 255, 255, 0.1);
    padding: 5px;
    height: 30px;
    border-radius: 4px;
    color: white;
    outline: none;
    border: none;
  }
}
</style>
<style>
.editor .vue-codemirror {
  flex: 1;
}
.editor .CodeMirror {
  height: 100%;
}
</style>
