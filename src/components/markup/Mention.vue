<script lang="tsx">
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    text: {
      type: String
    }
  },
  functional: true,
  render(h, ctx) {
    return <span class="mention">{ctx.props.text}</span>;
  }
});
</script>

<style>
.mention {
  display: inline-block;
  color: var(--link-color);
  font-weight: bold;
  cursor: pointer;
}
.mention:hover {
  text-decoration: underline;
}
</style>
