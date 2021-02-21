import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import { CUSTOM_EMOJI_REMOVE, CUSTOM_EMOJI_RENAME, CUSTOM_EMOJI_UPLOADED } from "@/socketEventConstants";
import date from "@/utils/date";
import { ActionTree } from "vuex";
import { CustomEmojisModule } from "../customEmojis";

const actions: ActionTree<any, any> = {
  [CUSTOM_EMOJI_RENAME](
    context,
    { emoji }: { emoji: { emojiID: string; name: string } }
  ) {
    CustomEmojisModule.UpdateEmoji({
      emojiID: emoji.emojiID,
      name: emoji.name
    });
  },
  [CUSTOM_EMOJI_UPLOADED](
    context,
    { emoji }: { emoji: { emojiID: string; name: string; gif: boolean } }
  ) {
    CustomEmojisModule.AddCustomEmoji({
      emojiID: emoji.emojiID,
      name: emoji.name,
      gif: emoji.gif
    });
  },
  [CUSTOM_EMOJI_REMOVE](
    context,
    { emoji }: { emoji: { emojiID: string } }
  ) {
    CustomEmojisModule.DeleteEmoji(emoji.emojiID);
  }
};
export default {
  actions
};
