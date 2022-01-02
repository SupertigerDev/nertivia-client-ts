import { CustomEmojisModule } from "@/store/modules/customEmojis";

export const onUploaded = (data: {
  emoji: { id: string; name: string; gif: boolean };
}) => {
  CustomEmojisModule.AddCustomEmoji({
    id: data.emoji.id,
    name: data.emoji.name,
    gif: data.emoji.gif,
  });
};
export const onRenamed = (data: {
  emoji: { id: string; name: string };
}) => {
  CustomEmojisModule.UpdateEmoji({
    id: data.emoji.id,
    name: data.emoji.name,
  });
};
export const onRemoved = (data: { emoji: { id: string } }) => {
  CustomEmojisModule.DeleteEmoji(data.emoji.id);
};
