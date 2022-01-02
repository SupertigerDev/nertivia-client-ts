import { h } from "vue";

import Message from "@/interfaces/Message";

import { ChannelsModule } from "@/store/modules/channels";
import { UsersModule } from "@/store/modules/users";

import MentionUser from "./markup/MentionUser.vue";
import MentionChannel from "./markup/MentionChannel.vue";
import MessageQuote from "./markup/MessageQuote.vue";
import CustomEmoji from "./markup/CustomEmoji.vue";
import Spoiler from "./markup/Spoiler.vue";
import Emoji from "./markup/Emoji.vue";
import Link from "./markup/Link.vue";
import CodeBlock from "./markup/CodeBlock.vue";

import {
  parseMarkup,
  Entity,
  Span,
  addTextSpans,
  UnreachableCaseError,
} from "nertivia-markup";
import "./Markup.scss";
import emojiParser from "@/utils/emojiParser";

interface MarkupProps {
  text: string;
  largeEmoji?: boolean;
  message?: Message;
  nestedLevel?: number;
  messageQuoteFormat?: "normal" | "text" | "hidden";
  inline?: boolean;
}

type CreateElement = any;
type RenderContext = {
  props: MarkupProps;
  textCount: number;
  emojiCount: number;
};

// todo: add a better system for this
const replaceOldMentions = (text: string) =>
  text
    .replaceAll(/<(@|#)(\d+)>/g, "[$1:$2]")
    .replaceAll(/<m(\d+)>/g, "[Q:$1]")
    // temporary names
    .replaceAll(
      /<g:([\w\d_-]+?):([\w\d_-]+?)>/g,
      "[animated_custom_emoji:$2:$1]"
    )
    .replaceAll(/<:([\w\d_-]+?):([\w\d_-]+?)>/g, "[custom_emoji:$2:$1]");

const transformEntities = (entity: Entity, ctx: RenderContext) =>
  entity.entities.map((e) => transformEntity(e, ctx));

const sliceText = (ctx: any, span: Span, { countText = true } = {}) => {
  const text = ctx.props.text.slice(span.start, span.end);
  if (countText && !/^\s+$/.test(text)) {
    ctx.textCount += text.length;
  }
  return text;
};

function transformEntity(entity: Entity, ctx: any) {
  switch (entity.type) {
    case "text": {
      if (entity.entities.length > 0) {
        return <span>{transformEntities(entity, ctx)}</span>;
      } else {
        return <span>{sliceText(ctx, entity.innerSpan)}</span>;
      }
    }
    case "bold":
    case "italic":
    case "underline":
    case "strikethrough": {
      // todo: style folding when there's no before/after for dom memory usage optimization
      // if(beforeSpan.start === beforeSpan.end && afterSpan.start === afterSpan.end) {}
      return <span class={entity.type}>{transformEntities(entity, ctx)}</span>;
    }
    case "code": {
      return <code class={entity.type}>{transformEntities(entity, ctx)}</code>;
    }
    case "codeblock": {
      if (!ctx.props.inline) {
        const lang = entity.params.lang;
        const value = sliceText(ctx, entity.innerSpan);
        return h(CodeBlock, { lang, value });
      } else {
        // Inline codeblock I guess
        return (
          <span class="codeblock">{sliceText(ctx, entity.innerSpan)}</span>
        );
      }
    }
    case "spoiler": {
      return <Spoiler>{transformEntities(entity, ctx)}</Spoiler>;
    }
    case "blockquote": {
      return <blockquote>{transformEntities(entity, ctx)}</blockquote>;
    }
    case "emoji_name": {
      const name = sliceText(ctx, entity.innerSpan, { countText: false });
      const emoji = emojiParser.findEmoji(name);
      if (emoji != null) {
        ctx.emojiCount += 1;
        return h(Emoji, { emoji });
      } else {
        return sliceText(ctx, entity.outerSpan);
      }
    }
    case "emoji": {
      const emoji = sliceText(ctx, entity.innerSpan, { countText: false });
      ctx.emojiCount += 1;
      return h(Emoji, { emoji: { unicode: emoji } });
    }
    case "custom": {
      return transformCustomEntity(entity, ctx);
    }
    case "link": {
      const url = sliceText(ctx, entity.innerSpan);
      return h(Link, { url });
    }
    case "color": {
      const { color } = entity.params;
      const lastCount = ctx.textCount;
      let el;
      if (color.startsWith("#")) {
        el = h("span", { style: { color } }, transformEntities(entity, ctx));
      } else {
        el = transformEntities(entity, ctx);
      }

      if (lastCount !== ctx.textCount) {
        return el;
      } else {
        return sliceText(ctx, entity.outerSpan);
      }
    }
    default: {
      throw new UnreachableCaseError(entity);
    }
  }
}

type CustomEntity = Entity & { type: "custom" };

function transformCustomEntity(entity: CustomEntity, ctx: any) {
  const type = entity.params.type;
  const expr = sliceText(ctx, entity.innerSpan, { countText: false });
  switch (type) {
    case "@": {
      let user = ctx.props.message?.mentions?.find((m) => m.id === expr);
      if (!user) {
        user = UsersModule.users[expr];
      }

      if (user) {
        ctx.textCount += expr.length;
        return h(MentionUser, {
          user: user,
        });
      }
      break;
    }
    case "#": {
      const channel = ChannelsModule.channels[expr];
      if (channel && channel.server_id) {
        ctx.textCount += expr.length;
        return h(MentionChannel, { channel });
      }
      break;
    }
    case "Q": {
      if (!ctx.props.inline) {
        const quoteFormat = ctx.props.messageQuoteFormat;
        if (quoteFormat === "hidden") {
          ctx.textCount += expr.length;
          return (
            <span
              class="hidden-quote"
              title="A quote that's hidden from the view"
            >
              (Hidden Quote){" "}
            </span>
          );
        }
        const quote = ctx.props.message?.quotes.find(
          (q) => q.messageID === expr
        );
        if (quote && quoteFormat != "text") {
          ctx.textCount += expr.length;
          return h(MessageQuote, {
            quote,
            user: quote.creator,
            message: ctx.props.message,
            nestedLevel: (ctx.props.nestedLevel ?? 0) + 1,
          });
        }
      }
      break;
    }
    case "animated_custom_emoji":
    case "custom_emoji": {
      const [id, name] = expr.split(":");
      ctx.emojiCount += 1;
      return h(CustomEmoji, {
        animated: type.startsWith("animated"),
        emojiName: name,
        id,
      });
    }
    case "link": {
      const [url, text] = expr.split("->").map((s) => s.trim());

      if (url && text) {
        ctx.textCount += text.length;
        return h(Link, { url: url, text: text });
      }

      break;
    }
    case "ruby": {
      const output: JSX.Element[] = [];
      const matches = expr.matchAll(/(.+?)\((.*?)\)/g);
      for (const match of matches) {
        const text = match[1].trim();
        const annotation = match[2].trim();

        output.push(
          <span>{text}</span>,
          <rp>(</rp>,
          <rt>{annotation}</rt>,
          <rp>)</rp>
        );
      }
      if (output.length > 0) {
        return <ruby>{output}</ruby>;
      }
      break;
    }
    // todo: maybe [^: text] but that might be better for superscript, who knows
    case "vertical": {
      if (!ctx.props.inline) {
        const output = expr.split("  ").join("\n").trim();

        if (output.length > 0) {
          return <div class="vertical">{output}</div>;
        }
      }
      break;
    }
    default: {
      console.warn("Unknown custom entity:", type);
    }
  }
  return <span>{sliceText(ctx, entity.outerSpan)}</span>;
}

const Component = (props: MarkupProps) => {
  const ctx = { props, emojiCount: 0, textCount: 0 };
  ctx.props.text = replaceOldMentions(ctx.props.text);
  const entity = addTextSpans(parseMarkup(ctx.props.text));
  const output = transformEntity(entity, ctx);

  return (
    <span
      class={{
        "large-emoji":
          !ctx.props?.inline &&
          ctx.props?.largeEmoji &&
          ctx.textCount === 0 &&
          ctx.emojiCount <= 5,
        inline: ctx.props?.inline,
      }}
    >
      {output}
    </span>
  );
};

Component.props = {
  text: String,
  message: Object,
  largeEmoji: {
    type: Boolean,
    default: true,
  },
  nestedLevel: Number,
  messageQuoteFormat: String as () => MarkupProps["messageQuoteFormat"],
  // If the markup should be rendered inline, so that the line-height height doesn't change.
  // this disables some features and restyles some others.
  inline: {
    type: Boolean,
    default: false,
  },
};

export default Component;
