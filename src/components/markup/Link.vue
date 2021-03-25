<script lang="tsx">
import { PopoutsModule } from "@/store/modules/popouts";
import Vue from "vue";

// todo: Add warning
export default Vue.extend({
  functional: true,
  props: {
    url: String,
    text: String
  },
  render(h, { props }) {
    const clicked = (event: any) => {
      const text = props.text ?? props.url;
      if (text !== props.url) {
        event.preventDefault();
        PopoutsModule.ShowPopout({
          id: "html-embed-url-sus",
          component: "OpenLinkConfirm",
          data: { url: props.url }
        });
      }
    };
    return (
      <a
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        onclick={clicked}
      >
        {props.text ?? props.url}
      </a>
    );
  }
});
</script>
