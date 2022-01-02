import twemoji from "twemoji";
import { matchSorter } from "match-sorter";

import emojis from "@/utils/emoji-data/emojis.json";
import groups from "@/utils/emoji-data/groups.json";
import { CustomEmojisModule } from "@/store/modules/customEmojis";

const U200D = String.fromCharCode(0x200d);
const UFE0Fg = /\uFE0F/g;

export const twemojiCodepoints = (emoji: string) =>
  twemoji.convert.toCodePoint(
    emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, "") : emoji
  );

/** Returns the path of the twemoji */
export const twemojiPath = (emoji: string) =>
  `${process.env.VUE_APP_TWEMOJI_LOCATION}${twemojiCodepoints(emoji)}.svg`;

interface EmojiURLOptions {
  animated?: boolean;
  isGif?: boolean;
  isCustom?: boolean;
}
export function emojiURL(
  emoji: string,
  { animated = false, isGif = false, isCustom = false }: EmojiURLOptions
) {
  if (isCustom) {
    return `${process.env.VUE_APP_NERTIVIA_CDN}emojis/${emoji}.${
      isGif ? "gif" : "png"
    }${!animated && isGif ? "?type=webp" : ""}`;
  } else {
    return twemojiPath(emoji);
  }
}

export const replaceShortcode = (message: string) => {
  const customEmojis = CustomEmojisModule.customEmojis;

  const regex = /:([\w]+):/g;

  return message.replace(regex, (x) => {
    // const emoji = emojiExists(x.replace(/[::]+/g, ""));
    // if (emoji) return emoji.unicode;

    const customEmoji = customEmojis.find(
      (e) => e.name === x.substr(1).slice(0, -1)
    );
    if (customEmoji) {
      if (customEmoji.gif) {
        return `<g:${customEmoji.name}:${customEmoji.id}>`;
      }
      return `<:${customEmoji.name}:${customEmoji.id}>`;
    }
    return x;
  });
};

export const emojiToShortcode = (message: string) => {
  // replace default emojis
  for (const emoji of emojis) {
    const search = emoji.unicode;
    const replace = `:${emoji.shortcodes[0]}:`;
    message = message.split(search).join(replace);
  }
  // replace custom emojis
  message = message.replace(/<(g?):([-\w]+):[-\w]+>/g, ":$2:");
  return message;
};

export const replaceEmojis = (message: string) => {
  return twemoji.parse(message, function (codepoint) {
    if (!codepoint) return message;
    return `${process.env.VUE_APP_TWEMOJI_LOCATION}${codepoint}.svg`;
  });
};

export const searchEmoji = (shortCode: string) => {
  // const customEmojis = store.state["settingsModule"].customEmojis;
  const customEmojis = CustomEmojisModule.customEmojis;
  return [
    ...matchSorter(customEmojis, shortCode, {
      keys: ["name"],
      threshold: matchSorter.rankings.CONTAINS,
    }),
    ...matchSorter(emojis, shortCode, {
      keys: ["shortcodes"],
      threshold: matchSorter.rankings.CONTAINS,
    }),
  ];
};

export const findEmoji = (shortCode: string) => {
  return emojis.find((emoji) => emoji.shortcodes.includes(shortCode));
};

export { emojis as ALL_EMOJIS, groups as ALL_EMOJI_GROUPS };

// kept for compatability
export default {
  emojiURL,
  replaceShortcode,
  emojiToShortcode,
  replaceEmojis,
  searchEmoji,
  findEmoji,
  twemojiPath,
  twemojiCodepoints,
  allEmojis: emojis,
  allGroups: groups,
};
