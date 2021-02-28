<script lang="tsx">
import Vue from "vue";

export default Vue.extend({
  functional: true,
  props: {
    url: String
  },
  render(h, { props }) {
    return (
      <a href={props.url} target="_blank" rel="noopener noreferrer">
        {props.url}
      </a>
    );
  }
});
</script>
