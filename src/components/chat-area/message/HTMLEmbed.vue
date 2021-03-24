<script lang="tsx">
import Vue from "vue";
import { unzipAlt } from "@/utils/zip";
import { JsonInput } from "jsonhtmlfyer";
import Markup from "@/components/Markup.tsx";
import { PopoutsModule } from "@/store/modules/popouts";

interface Props {
  compressedJSON: string;
}
export default Vue.extend<Props>({
  functional: true,
  render(h, { props }) {
    let obj: any = {};
    try {
      obj = JSON.parse(unzipAlt(props.compressedJSON) || "");
    } catch {
      return <div />;
    }
    const clickEvent = (event: any) => {
      event.preventDefault();
      const target = event.target.closest("a");
      if (!target) return;
      const url = target.getAttribute("href");
      if (!url) return;

      PopoutsModule.ShowPopout({
        id: "html-embed-url-sus",
        component: "OpenLinkConfirm",
        data: { url }
      });
    };

    const template = (json: JsonInput) => {
      if (json.attributes?.href) {
        if (!json.attributes.href.startsWith("http")) {
          json.attributes.href = "https://" + json.attributes.href;
        }
      }
      if (json.styles?.backgroundImage) {
        json.styles.backgroundImage = `url(${
          process.env.VUE_APP_IMAGE_PROXY_URL
        }${encodeURIComponent(json.styles.backgroundImage)})`;
      }
      if (json.tag === "img" && json.attributes?.src) {
        json.attributes.src =
          process.env.VUE_APP_IMAGE_PROXY_URL +
          encodeURIComponent(json.attributes.src);
      }
      if (json.styles?.position === "fixed") {
        delete json.styles.position;
      }
      if (json.styles?.background) {
        delete json.styles.background;
      }
      const el = h(json.tag, {
        style: json.styles,
        attrs: json.attributes
      });
      el.children = [];
      if (typeof json.content === "object") {
        if (Array.isArray(json.content)) {
          for (let i = 0; i < json.content.length; i++) {
            el.children.push(template(json.content[i]));
          }
          return el;
        } else {
          el.children.push(template(json.content));
          return el;
        }
      }
      if (json.content) {
        el.children = [
          <div class="content">
            {h(Markup, {
              props: {
                text: json.content
              }
            })}
          </div>
        ];
      }
      return el;
    };

    return h("div", { class: "html-embed", on: { click: clickEvent } }, [
      template(obj)
    ]);
  }
});
</script>

<style scoped>
.html-embed {
  display: flex;
  max-width: 500px;
  max-height: 500px;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre-wrap;
  overflow: hidden;
  flex-shrink: 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  position: relative;
  margin-left: 50px;
}
</style>
