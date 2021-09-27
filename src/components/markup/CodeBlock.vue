<template>
  <div class="codeblock">
    <div class="header">
      <div class="language">{{ langName || lang || "Text" }}</div>
      <div class="material-icons" @click="copy">content_copy</div>
    </div>
    <code v-if="langName" :innerHTML="highlightedValue"></code>
    <code v-else>{{ value }}</code>
  </div>
</template>

<script lang="tsx">
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";

import { defineComponent } from "vue";
export default defineComponent({
  props: {
    lang: String,
    value: String,
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.value || "");
    },
  },
  computed: {
    langName(): string | undefined {
      return hljs.getLanguage(this.lang as string)?.name;
    },
    // codeOrlanguageName: string, optionsOrCode: string | HighlightOptions, ignoreIllegals?: boolean | undefined, continuation?: Mode | undefined
    highlightedValue(): string {
      return hljs.highlight(this.value as string, {
        ignoreIllegals: true,
        language: this.lang as string,
      })?.value;
    },
  },
});
</script>

<style scoped>
.header {
  border-bottom: solid 1px rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  align-content: center;
  padding-bottom: 2px;
}
.header .language {
  opacity: 0.6;
  flex: 1;
  margin-right: 5px;
}
.header .material-icons {
  opacity: 0.6;
  transition: 0.2s;
  font-size: 16px;
  cursor: pointer;
}
.header .material-icons:hover {
  opacity: 0.8;
}
</style>
