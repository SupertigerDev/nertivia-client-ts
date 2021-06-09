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
    if (!hljs.getLanguage(props.lang)) {
      return <code>{props.value}</code>;
    }
    const value = hljs.highlight(props.lang, props.value, true).value;
    return (
      <div>
        <code domPropsInnerHTML={value}></code>
      </div>
    );
  }
});
</script>
