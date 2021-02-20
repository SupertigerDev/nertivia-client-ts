import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import date from "@/utils/date";
import { ActionTree } from "vuex";
import { CustomEmojisModule } from "../customEmojis";

const actions: ActionTree<any, any> = {
  ["socket_customEmoji:rename"](
    context,
    { emoji }: { emoji: { emojiID: string; name: string } }
  ) {
    CustomEmojisModule.UpdateEmoji({
      emojiID: emoji.emojiID,
      name: emoji.name
    });
  },
  ["socket_customEmoji:uploaded"](
    context,
    { emoji }: { emoji: { emojiID: string; name: string; gif: boolean } }
  ) {
    CustomEmojisModule.AddCustomEmoji({
      emojiID: emoji.emojiID,
      name: emoji.name,
      gif: emoji.gif
    });
  },
  ["socket_customEmoji:remove"](
    context,
    { emoji }: { emoji: { emojiID: string } }
  ) {
    CustomEmojisModule.DeleteEmoji(emoji.emojiID);
  }
};
export default {
  actions
};
