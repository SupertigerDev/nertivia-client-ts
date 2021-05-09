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
  height: 1.4em;
  width: 1.4em;
  vertical-align: -7.5px;
  margin: 1px;
}
</style>
