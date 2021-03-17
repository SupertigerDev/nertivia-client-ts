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

import { parseMarkup, Entity, Span, addTextSpans, UnreachableCaseError } from 'nevula'
import './Markup.scss'

interface MarkupProps {
  text: string;
  largeEmoji: boolean;
  message?: Message;
}

type RenderContext = Vue.RenderContext<MarkupProps>

const replaceOldMentions = (text: string) =>
  text.replaceAll(/<(@|#)(\d+)>/g, '[$1:$2]')
    .replaceAll(/<m(\d+)>/g, '[Q:$1]')
    .replaceAll(/<(g?):([\w\d_-]+?):([\w\d_-]+?)>/g, '[🔣:$2$1]')

const transformEntities = (h: CreateElement, entity: Entity, ctx: RenderContext) => entity.entities.map(e => transformEntity(h, e, ctx))

function transformEntity(h: CreateElement, entity: Entity, ctx: RenderContext) {
  switch (entity.type) {
    case "text": {
      if (entity.entities.length > 0) {
        return <span>{transformEntities(h, entity, ctx)}</span>
      } else {
        return <span>{ctx.props.text.slice(entity.innerSpan.start, entity.innerSpan.end)}</span>
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
      return <pre class="codeblock"><code>{transformEntities(h, entity, ctx)}</code></pre>
    }
    case "blockquote": {
      return <blockquote>{transformEntities(h, entity, ctx)}</blockquote>
    }
    case "custom": {
      return transformCustomEntity(h, entity, ctx)
    }
    default: {
      throw new UnreachableCaseError(entity['type'] as never)
    }
  }
}

type CustomEntity = Entity & { type: "custom" }

function transformCustomEntity(h: CreateElement, entity: CustomEntity, ctx: RenderContext) {
  const type = entity.params.type
  const expr = ctx.props.text.slice(entity.innerSpan.start, entity.innerSpan.end)
  switch (type) {
    case '@': {
      const user = UsersModule.users[expr];
      if (user) {
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
        return h(MentionChannel, { props: { channel } })
      }
      break
    }
    case "Q": {
      const quote = ctx.props.message?.quotes.find(
        q => q.messageID === expr
      );
      if (quote) {
        return h(MessageQuote, {
          props: {
            quote,
            user: quote.creator
          }
        })
      }
      break;
    }
    default: {
      console.warn('Unknown custom entity:', type)
    }
  }
  return <span>{ctx.props.text.slice(entity.outerSpan.start, entity.outerSpan.end)}</span>
}

export default Vue.extend<MarkupProps>({
  functional: true,
  props: {
    text: String,
    largeEmoji: Boolean,
    message: Object
  },
  render(h, ctx) {
    ctx.props.text = replaceOldMentions(ctx.props.text);
    const entity = addTextSpans(parseMarkup(ctx.props.text))
    return transformEntity(h, entity, ctx)
  }
})