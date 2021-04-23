<template>
  <div class="editor" v-if="theme">
    <div class="menu-strip">
      <input type="text" v-model="name" placeholder="Theme Name" />
      <CustomButton name="Save & Apply" icon="done" />
    </div>
    <codemirror v-model="css" :options="cmOptions" @ready="onCodemirrorReady" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getTheme, Theme } from "@/services/themeService";
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
  async mounted() {
    this.theme = await getTheme(this.themeID);
    this.css = this.theme.css;
    this.name = this.theme.name;
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
    margin-left: 5px;
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
