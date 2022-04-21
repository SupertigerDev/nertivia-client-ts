<script lang="tsx">
import { jsonHtml } from "@/services/userService";
import { unzipAlt } from "@/utils/zip";
import { h } from "vue";
import Markup from "./Markup";
import "style-scoped";
import { PopoutsModule } from "@/store/modules/popouts";

const SafeHtml = (props: { zippedJsonHtml: string }) => {
  const jsonHtml = JSON.parse(
    unzipAlt(props.zippedJsonHtml) || "[]"
  ) as jsonHtml[];

  function replaceImageUrl(val: string) {
    const regex = /url\((.*?)\)/gm;
    const regex2 = /url\((.*?)\)/m;

    return val.replaceAll(regex, (r) => {
      let url = regex2.exec(r)?.[1];
      if (!url) return r;
      if (url.startsWith(`"`) || url.startsWith(`'`)) {
        url = url.slice(1, -1);
      }
      return `url("${
        process.env.VUE_APP_IMAGE_PROXY_URL + encodeURIComponent(url)
      }")`;
    });
  }

  const onUrlClick = (event: any) => {
    event.preventDefault();
    const target = event.target.closest("a");
    if (!target) return;
    const url = target.getAttribute("href");
    if (!url) return;

    PopoutsModule.ShowPopout({
      id: "html-embed-url-sus",
      component: "OpenLinkConfirm",
      data: { url },
    });
  };

  function generate(jsonEl: jsonHtml | string, style?: boolean) {
    if (typeof jsonEl === "string") {
      if (style) {
        return replaceImageUrl(jsonEl);
      }
      if (!jsonEl.trim()) {
        return "";
      }
      return h(Markup, { text: jsonEl });
    }

    let childrenEl =
      jsonEl.content?.map((json) => generate(json, jsonEl.tag === "style")) ||
      [];

    const attrs: any = { ...jsonEl.attributes };
    if (attrs.style) {
      attrs.style = replaceImageUrl(attrs.style);
    }
    if (attrs.src) {
      attrs.src =
        process.env.VUE_APP_IMAGE_PROXY_URL + encodeURIComponent(attrs.src);
    }
    if (jsonEl.tag === "a") {
      if (!attrs.href.startsWith("http")) {
        attrs.href = `https://${attrs.href}`;
      }
      attrs.onClick = onUrlClick;
    }
    if (jsonEl.tag === "style") {
      attrs.scoped = "";
    }
    const el = h(jsonEl.tag, attrs, childrenEl);
    return el;
  }

  return h(
    "div",
    { class: "json-html" },
    Array.isArray(jsonHtml)
      ? jsonHtml?.map((json) => generate(json))
      : [generate(jsonHtml)]
  );
};

export default SafeHtml;
</script>

<style scoped>
.json-html {
  margin: 3px;
  max-height: 100px;
  overflow: auto;
  flex-shrink: 0;
}
</style>
