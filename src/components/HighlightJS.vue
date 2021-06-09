<script lang="tsx">
import Vue from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";

export default Vue.extend({
  functional: true,
  props: {
    lang: String,
    value: String
  },
  render(h, { props }) {
    const lang = hljs.getLanguage(props.lang);
    const header = (code: string, lang?: string) => {
      return (
        <div class="header">
          <div class="language">{lang || "Text"}</div>
          <div
            class="material-icons"
            onClick={() => {
              navigator.clipboard.writeText(code);
            }}
          >
            content_copy
          </div>
        </div>
      );
    };
    if (!lang) {
      return (
        <pre class="codeblock">
          {header(props.value, props.lang)}
          <code>{props.value}</code>
        </pre>
      );
    }
    const value = hljs.highlight(props.lang, props.value, true).value;
    return (
      <pre class="codeblock">
        {header(props.value, lang.name)}
        <code domPropsInnerHTML={value}></code>
      </pre>
    );
  }
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
