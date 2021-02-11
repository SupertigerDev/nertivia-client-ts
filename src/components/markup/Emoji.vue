<script>
import emojiParser from "@/utils/emojiParser";

export default {
  functional: true,
  props: ["emoji"],
  render(h, { props }) {
    const { emoji } = props;
    return (
      <img
        class="emoji"
        draggable="false"
        title={emoji.annotation}
        alt={emoji.annotation}
        src={emojiParser.emojiPath(emoji.unicode)}
      />
    );
  }
};
</script>

<style scoped>
.emoji {
  object-fit: contain;
  height: 2em;
  width: 2em;
  margin: 1px;
  vertical-align: -9px;
}
</style>
