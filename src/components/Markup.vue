<script lang="tsx">
import Vue from "vue";
import MessageQuote from "./markup/MessageQuote.vue";
import CustomEmoji from "./markup/CustomEmoji.vue";
import Message from "@/interfaces/Message";
import { ServerMembersModule } from "@/store/modules/serverMembers";

/**
 * given a record of names and regex patterns, generate a regex of all of the combined patterns
 */
const generateRegex = (parts: Record<string, RegExp>) => {
  return RegExp(
    Object.entries(parts)
      .map(([type, pattern]) => `(?<${type}>${pattern.source})`)
      .join("|"),
    "g"
  );
};

const MARKUP_REGEX = generateRegex({
  internal_code: /<(m|@|#)(\d+)>/,
  emoji: /:(\w+?):/,
  custom_emoji: /<(g?):([\w\d_-]+?):([\w\d_-]+?)>/
});

interface MarkupProps {
  text: string;
  largeEmoji: boolean;
  message?: Message;
}

export default Vue.extend<MarkupProps>({
  functional: true,
  props: {
    text: String,
    largeEmoji: Boolean,
    message: Object
  },
  render(h, { props }) {
    const input = props.text;
    const result = [];
    let lastIndex = 0;

    let emojiCount = 0;
    let textCount = 0;

    const addText = (index: number) => {
      if (index > lastIndex) {
        textCount += 1;
        result.push(input.slice(lastIndex, index));
      }
    };

    for (const match of input.matchAll(MARKUP_REGEX)) {
      addText(match.index!);
      lastIndex = (match.index ?? 0) + match[0].length;

      // note(bree):
      // a match can be guranteed here because the regex generator makes sure all matches have a match type
      // I'm not running runtime checks on these for performance
      const matchType = Object.entries(match.groups!).find(e => e[1])![0];
      const matchArgs = match.filter(e => e != null).slice(1);

      switch (matchType) {
        case "internal_code":
          switch (matchArgs[1]) {
            case "m": {
              const quote = props.message?.quotes.find(
                q => q.messageID === matchArgs[2]
              );
              if (quote) {
                const serverMember = { member: quote.creator, roles: [] };
                result.push(
                  h(MessageQuote, {
                    props: {
                      quote,
                      member: serverMember
                    }
                  })
                );
              } else {
                result.push(matchArgs[0]);
              }
              break;
            }
            case "@":
              // todo:
              // result.push(<MentionMember id={matchArgs[2]} />);
              break;
            case "#":
              // todo:
              // result.push(<MentionChannel id={matchArgs[2]} />);
              break;
          }
          break;
        case "emoji":
          emojiCount += 1;
          // todo:
          // result.push(<Emoji name={matchArgs[1]} />);
          break;
        case "custom_emoji":
          emojiCount += 1;
          result.push(
            h(CustomEmoji, {
              props: {
                animated: matchArgs[1] === "g",
                emojiName: matchArgs[2],
                emojiID: matchArgs[3]
              }
            })
          );
          break;
      }
    }
    addText(input.length);

    return (
      <span
        class={{
          "large-emoji": props.largeEmoji && textCount === 0 && emojiCount <= 5
        }}
      >
        {result}
      </span>
    );
  }
});
</script>

<style scoped>
.large-emojis .emoji {
  height: 5em;
  width: 5em;
}
</style>
