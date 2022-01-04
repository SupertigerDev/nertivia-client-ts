<script lang="tsx">
import { h } from "vue";
import { unzipAlt } from "@/utils/zip";
import { JsonInput } from "jsonhtmlfyer";
import Markup from "@/components/Markup";
import { PopoutsModule } from "@/store/modules/popouts";

interface Props {
  compressedJSON: string;
  leftPadding: boolean;
}
export default function HTMLEmbed(props: Props) {
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
      data: { url },
    });
  };

  const createEl = (json: JsonInput, children: any[]) =>
    h(
      json.tag,
      {
        style: json.styles,
        ...json.attributes,
      },
      children
    );

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

    let children: any[] = [];
    if (typeof json.content === "object") {
      if (Array.isArray(json.content)) {
        for (let i = 0; i < json.content.length; i++) {
          children.push(template(json.content[i]));
        }
        return createEl(json, children);
      } else {
        children.push(template(json.content));
        return createEl(json, children);
      }
    }
    if (json.content) {
      children = [
        <div class="content">
          {h(Markup, {
            text: json.content,
          })}
        </div>,
      ];
    }
    return createEl(json, children);
  };
  const leftPadding = props.leftPadding ? "left-padding" : "";
  return h("div", { class: "html-embed " + leftPadding, on: { click: clickEvent } }, [
    template(obj),
  ]);
}
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
}
.html-embed.left-padding {
  margin-left: 50px;
}
</style>
