import Vue from "vue";
import Message from "@/interfaces/Message";
import { parseMarkup, Entity, Span, addTextSpans, UnreachableCaseError } from 'nevula'
import { CreateElement } from 'vue';
import './Markup.scss'

interface MarkupProps {
  text: string;
  largeEmoji: boolean;
  message?: Message;
}

interface TransformContext {
  text: string,
}

type RenderContext = Vue.RenderContext<MarkupProps>

const transformEntities = (h: CreateElement, entity: Entity, ctx: RenderContext) => entity.entities.map(e => transformEntity(h, e, ctx))

function transformEntity(h: CreateElement, entity: Entity, ctx: RenderContext) {
  const type = entity.type;
  switch (type) {
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
    case "strikethrough":
    case "code": {
      // todo: style folding when there's no before/after for dom memory usage optimization
      // if(beforeSpan.start === beforeSpan.end && afterSpan.start === afterSpan.end) {}
      return <span class={entity.type}>{transformEntities(h, entity, ctx)}</span>
    }
    case "codeblock": {
      return <pre class="codeblock"><code>{transformEntities(h, entity, ctx)}</code></pre>
    }
    case "blockquote": {
      return <blockquote>{transformEntities(h, entity, ctx)}</blockquote>
    }
    case "custom": {
      return <span>What</span>
    }
    default: {
      throw new UnreachableCaseError(type)
    }
  }
}

export default Vue.extend<MarkupProps>({
  functional: true,
  props: {
    text: String,
    largeEmoji: Boolean,
    message: Object
  },
  render(h, ctx) {
    const entity = addTextSpans(parseMarkup(ctx.props.text))
    return transformEntity(h, entity, ctx)
  }
})