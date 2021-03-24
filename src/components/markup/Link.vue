<script lang="tsx">
import Vue from "vue";

// todo: Add warning
export default Vue.extend({
  functional: true,
  props: {
    url: String,
    text: String
  },
  render(h, { props }) {
    return (
      <a href={props.url} target="_blank" rel="noopener noreferrer">
        {props.text ?? props.url}
      </a>
    );
  }
});
</script>
