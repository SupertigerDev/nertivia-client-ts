<script lang="tsx">
import Vue from "vue";
import MessageQuote from "./markup/MessageQuote.vue";
import CustomEmoji from "./markup/CustomEmoji.vue";
import Message from "@/interfaces/Message";
import { ChannelsModule } from "@/store/modules/channels";
import { UsersModule } from "@/store/modules/users";
import MentionUser from "./markup/MentionUser.vue";
import MentionChannel from "./markup/MentionChannel.vue";
import emojiParser from "@/utils/emojiParser";
import Emoji from "./markup/Emoji.vue";

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
    largeEmoji: {
      type: Boolean,
      default: true
    },
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
        const slice = input.slice(lastIndex, index);
        // if not all whitespace, add to text count
        if (!/^\s+$/.test(slice)) {
          textCount += slice.length;
        }
        result.push(slice);
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
                result.push(
                  h(MessageQuote, {
                    props: {
                      quote,
                      user: quote.creator
                    }
                  })
                );
              } else {
                result.push(matchArgs[0]);
              }
              break;
            }
            case "@":
              {
                const user = UsersModule.users[matchArgs[2]];
                if (user) {
                  result.push(
                    h(MentionUser, {
                      props: {
                        user: user
                      }
                    })
                  );
                } else {
                  result.push(matchArgs[0]);
                }
              }
              break;
            case "#":
              {
                const channel = ChannelsModule.channels[matchArgs[2]];
                if (channel) {
                  result.push(h(MentionChannel, { props: { channel } }));
                } else {
                  matchArgs[0];
                }
              }
              break;
          }
          break;
        case "emoji":
          {
            const emoji = emojiParser.findEmoji(matchArgs[1]);
            if (emoji != null) {
              emojiCount += 1;
              result.push(
                h(Emoji, {
                  props: { emoji }
                })
              );
            } else {
              result.push(matchArgs[0]);
            }
          }
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
.large-emoji .emoji {
  height: 5em;
  width: 5em;
}
</style>
