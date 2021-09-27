import { CustomEmojisModule } from "@/store/modules/customEmojis";

export const onUploaded = (data: {
  emoji: { emojiID: string; name: string; gif: boolean };
}) => {
  CustomEmojisModule.AddCustomEmoji({
    emojiID: data.emoji.emojiID,
    name: data.emoji.name,
    gif: data.emoji.gif,
  });
};
export const onRenamed = (data: {
  emoji: { emojiID: string; name: string };
}) => {
  CustomEmojisModule.UpdateEmoji({
    emojiID: data.emoji.emojiID,
    name: data.emoji.name,
  });
};
export const onRemoved = (data: { emoji: { emojiID: string } }) => {
  CustomEmojisModule.DeleteEmoji(data.emoji.emojiID);
};
