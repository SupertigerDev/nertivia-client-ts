<script lang="tsx">
import Vue from "vue";
import windowProperties from "@/utils/windowProperties";
const EMOJI_URL = process.env.VUE_APP_NERTIVIA_CDN + "emojis";

// todo: make CustomEmoji based on an Emoji class
export default Vue.extend({
  functional: true,
  props: {
    emojiID: String,
    emojiName: String,
    animated: Boolean
  },
  render(h, { props }) {
    return (
      <img
        class={{
          emoji: true,
          "custom-emoji": true
        }}
        title={props.emojiName}
        alt={props.emojiName}
        src={`${EMOJI_URL}/${props.emojiID}.${props.animated ? "gif" : "png"}${
          !windowProperties.isFocused ? "?type=webp" : ""
        }`}
      />
    );
  }
});
</script>

<style>
.emoji {
  object-fit: contain;
  height: 2em;
  width: 2em;
  margin: 1px;
  vertical-align: -9px;
}
</style>
