import Vue from "vue";
import { CreateElement } from 'vue';

import Message from "@/interfaces/Message";

import { ChannelsModule } from "@/store/modules/channels";
import { UsersModule } from "@/store/modules/users";

import MentionUser from "./markup/MentionUser.vue";
import MentionChannel from "./markup/MentionChannel.vue";
import MessageQuote from "./markup/MessageQuote.vue";
import CustomEmoji from "./markup/CustomEmoji.vue";
import Link from "./markup/Link.vue";
import Emoji from "./markup/Emoji.vue";

import { parseMarkup, Entity, Span, addTextSpans, UnreachableCaseError } from 'nertivia-markup'
import './Markup.scss'
import emojiParser from '@/utils/emojiParser';
import { VNode } from 'vue/types/umd';

interface MarkupProps {
  text: string;
  largeEmoji: boolean;
  message?: Message;
}

type RenderContext = Vue.RenderContext<MarkupProps> & { textCount: number, emojiCount: number }

// todo: add a better system for this
const replaceOldMentions = (text: string) =>
  text.replaceAll(/<(@|#)(\d+)>/g, '[$1:$2]')
    .replaceAll(/<m(\d+)>/g, '[Q:$1]')
    // temporary names
    .replaceAll(/<g:([\w\d_-]+?):([\w\d_-]+?)>/g, '[animated_custom_emoji:$2:$1]')
    .replaceAll(/<:([\w\d_-]+?):([\w\d_-]+?)>/g, '[custom_emoji:$2:$1]')


const transformEntities = (h: CreateElement, entity: Entity, ctx: RenderContext) => entity.entities.map(e => transformEntity(h, e, ctx))


const sliceText = (ctx: RenderContext, span: Span, { countText = true } = {}) => {
  const text = ctx.props.text.slice(span.start, span.end)
  if (countText && !/^\s+$/.test(text)) {
    ctx.textCount += text.length
  }
  return text
}

function transformEntity(h: CreateElement, entity: Entity, ctx: RenderContext) {
  switch (entity.type) {
    case "text": {
      if (entity.entities.length > 0) {
        return <span>{transformEntities(h, entity, ctx)}</span>
      } else {
        return <span>{sliceText(ctx, entity.innerSpan)}</span>
      }
    }
    case "bold":
    case "italic":
    case "underline":
    case "strikethrough": {
      // todo: style folding when there's no before/after for dom memory usage optimization
      // if(beforeSpan.start === beforeSpan.end && afterSpan.start === afterSpan.end) {}
      return <span class={entity.type}>{transformEntities(h, entity, ctx)}</span>
    }
    case "code": {
      return <code class={entity.type}>{transformEntities(h, entity, ctx)}</code>
    }
    case "codeblock": {
      // todo: add lightweight highlighting
      return <pre class="codeblock"><code>{transformEntities(h, entity, ctx)}</code></pre>
    }
    case "blockquote": {
      return <blockquote>{transformEntities(h, entity, ctx)}</blockquote>
    }
    case "emoji_name": {
      const name = sliceText(ctx, entity.innerSpan, { countText: false })
      const emoji = emojiParser.findEmoji(name)
      if (emoji != null) {
        ctx.emojiCount += 1
        return h(Emoji, { props: { emoji } })
      } else {
        return sliceText(ctx, entity.outerSpan)
      }
    }
    case "emoji": {
      const emoji = sliceText(ctx, entity.innerSpan, { countText: false })
      ctx.emojiCount += 1
      return h(Emoji, { props: { emoji: { unicode: emoji } } })
    }
    case "custom": {
      return transformCustomEntity(h, entity, ctx)
    }
    case "link": {
      const url = sliceText(ctx, entity.innerSpan)
      return h(Link, { props: { url } })
    }
    default: {
      throw new UnreachableCaseError(entity)
    }
  }
}

type CustomEntity = Entity & { type: "custom" }

function transformCustomEntity(h: CreateElement, entity: CustomEntity, ctx: RenderContext) {
  const type = entity.params.type
  const expr = sliceText(ctx, entity.innerSpan, { countText: false })
  switch (type) {
    case '@': {
      const user = UsersModule.users[expr];
      if (user) {
        ctx.textCount += expr.length
        return h(MentionUser, {
          props: {
            user: user
          }
        })
      }
      break
    }
    case "#": {
      const channel = ChannelsModule.channels[expr];
      if (channel) {
        ctx.textCount += expr.length
        return h(MentionChannel, { props: { channel } })
      }
      break
    }
    case "Q": {
      const quote = ctx.props.message?.quotes.find(
        q => q.messageID === expr
      );
      if (quote) {
        ctx.textCount += expr.length
        return h(MessageQuote, {
          props: {
            quote,
            user: quote.creator
          }
        })
      }
      break;
    }
    case "animated_custom_emoji":
    case "custom_emoji": {
      const [id, name] = expr.split(':')
      ctx.emojiCount += 1
      return h(CustomEmoji, {
        props: {
          animated: type.startsWith("animated"),
          emojiName: name,
          emojiID: id
        }
      })
    }
    case "link": {
      const [url, text] = expr
        .split("->")
        .map(s => s.trim());

      if (url && text) {
        ctx.textCount += text.length
        return h(Link, { props: { url: url, text: text } })
      }

      break
    }
    case "ruby": {
      const output: VNode[] = []
      const matches = expr.matchAll(/(.+?)\((.*?)\)/g)
      for (const match of matches) {
        const text = match[1].trim();
        const annotation = match[2].trim();

        output.push(
          <span>{text}</span>,
          <rp>(</rp>,
          <rt>{annotation}</rt>,
          <rp>)</rp>
        )
      }
      if (output.length > 0) {
        return <ruby>{output}</ruby>
      }
      break
    }
    default: {
      console.warn('Unknown custom entity:', type)
    }
  }
  return <span>{sliceText(ctx, entity.outerSpan)}</span>
}

export default Vue.extend<MarkupProps>({
  functional: true,
  props: {
    text: String,
    largeEmoji: Boolean,
    message: Object
  },
  render(h, renderContext) {
    renderContext.props.text = replaceOldMentions(renderContext.props.text);
    const ctx = { ...renderContext, emojiCount: 0, textCount: 0 };
    const entity = addTextSpans(parseMarkup(ctx.props.text))
    const output = transformEntity(h, entity, ctx)
    return <span class={{
      "large-emoji": ctx.textCount === 0 && ctx.emojiCount <= 5
    }}>{output}</span>
  }
})