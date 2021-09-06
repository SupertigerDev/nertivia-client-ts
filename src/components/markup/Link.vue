<script lang="tsx">
import router from "@/router";
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
    let sanitizedUrl = props.url;
    if (!props.url.startsWith("http")) {
      sanitizedUrl = "https://" + props.url;
    }
    const pushRouter = (link: string) => {
      const match = process.env.VUE_APP_MAIN_APP_URL + "app";
      if (link.startsWith(match)) {
        router.push(
          "/" + link.split(process.env.VUE_APP_MAIN_APP_URL as string)[1]
        );
        return true;
      }
      return false;
    };
    const clicked = (event: any) => {
      const text = props.text ?? sanitizedUrl;
      if (text !== sanitizedUrl) {
        PopoutsModule.ShowPopout({
          id: "html-embed-url-sus",
          component: "OpenLinkConfirm",
          data: { url: sanitizedUrl }
        });
        event.preventDefault();
        return;
      }
      if (pushRouter(sanitizedUrl)) {
        event.preventDefault();
      }
    };
    return (
      <a
        href={sanitizedUrl}
        target="_blank"
        rel="noopener noreferrer"
        onclick={clicked}
      >
        {props.text ?? sanitizedUrl}
      </a>
    );
  }
});
</script>
