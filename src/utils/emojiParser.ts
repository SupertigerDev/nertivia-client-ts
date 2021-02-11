import twemoji from "twemoji";
import { matchSorter } from "match-sorter";

import emojis from "@/utils/emoji-data/emojis.json";
import groups from "@/utils/emoji-data/groups.json";
import config from "@/config";
import { CustomEmojisModule } from "@/store/modules/customEmojis";

const U200D = String.fromCharCode(0x200d);
const UFE0Fg = /\uFE0F/g;

const emojiIconId = (emoji: string) =>
  twemoji.convert.toCodePoint(
    emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, "") : emoji
  );

export default {
  getCustomEmojisByShortCode(shortcode: string) {
    // const customEmojis = store.state["settingsModule"].customEmojis;
    // return customEmojis.find(emoji => emoji.name === shortcode);
    return [];
  },
  replaceShortcode: (message: string) => {
    const customEmojis = CustomEmojisModule.customEmojis;

    const regex = /:([\w]+):/g;

    return message.replace(regex, x => {
      // const emoji = emojiExists(x.replace(/[::]+/g, ""));
      // if (emoji) return emoji.unicode;

      const customEmoji = customEmojis.find(
        e => e.name === x.substr(1).slice(0, -1)
      );
      if (customEmoji) {
        if (customEmoji.gif) {
          return `<g:${customEmoji.name}:${customEmoji.emojiID}>`;
        }
        return `<:${customEmoji.name}:${customEmoji.emojiID}>`;
      }
      return x;
    });
  },
  emojiToShortcode: (message: string) => {
    // replace default emojis
    for (const emoji of emojis) {
      const search = emoji.unicode;
      const replace = `:${emoji.shortcodes[0]}:`;
      message = message.split(search).join(replace);
    }
    // replace custom emojis
    message = message.replace(/<(g?):([-\w]+):[-\w]+>/g, ":$2:");
    return message;
  },
  replaceEmojis: (message: string) => {
    return twemoji.parse(message, function(icon) {
      if (!icon) return message;
      return config.twemojiLocations + icon + ".svg";
    });
  },
  GetEmojiPath: (string: string) => {
    // let emojiPath;
    // twemoji.parse(string, function(icon) {
    //   if (!icon) return string;
    //   emojiPath = require("../assets/twemoji/" + icon + ".svg");
    // });
    // return emojiPath;
    return "wut";
  },
  searchEmoji: (shortCode: string) => {
    // const customEmojis = store.state["settingsModule"].customEmojis;
    const customEmojis: any = [];
    return [
      ...matchSorter(customEmojis, shortCode, {
        keys: ["name"],
        threshold: matchSorter.rankings.CONTAINS
      }),
      ...matchSorter(emojis, shortCode, {
        keys: ["shortcodes"],
        threshold: matchSorter.rankings.CONTAINS
      })
    ];
  },
  findEmoji: (shortCode: string) => {
    return emojis.find(emoji => emoji.shortcodes.includes(shortCode));
  },
  // todo; emoji type
  emojiPath: (emoji: string) =>
    `${config.twemojiLocations}${emojiIconId(emoji)}.svg`,
  allEmojis: emojis,
  allGroups: groups
};

function emojiExists(shortCode: string) {
  return emojis.find(emoji =>
    emoji.shortcodes.find(emojiShortCode => shortCode === emojiShortCode)
  );
}
