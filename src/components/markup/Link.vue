<script lang="tsx">
import router from "@/router";
import { PopoutsModule } from "@/store/modules/popouts";

import { defineComponent, computed } from "vue";
export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    text: String,
  },
  setup(props) {
    let sanitizedUrl = computed(() => {
      let url = props.url;
      if (!props.url.startsWith("http")) {
        url = url = "https://" + props.url;
      }
      return url;
    });

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
      const text = props.text || sanitizedUrl.value;

      if (text !== sanitizedUrl.value) {
        PopoutsModule.ShowPopout({
          id: "html-embed-url-sus",
          component: "OpenLinkConfirm",
          data: { url: sanitizedUrl },
        });
        event.preventDefault();
        return;
      }
      if (pushRouter(sanitizedUrl.value)) {
        event.preventDefault();
      }
    };

    return () => (
      <a
        href={sanitizedUrl.value}
        target="_blank"
        rel="noopener noreferrer"
        onClick={clicked}
      >
        {props.text ?? sanitizedUrl.value}
      </a>
    );
  },
});
</script>
