<template>
  <div class="message-embed" :class="{ image: imageEmbed }">
    <TenorEmbed v-if="tenorEmbed" :embed="embed" />
    <ImageEmbed v-else-if="imageEmbed" :image="imageEmbed" />
    <YoutubeEmbed v-else-if="youtubeEmbed" :embed="embed" />
    <GenericEmbed v-else :embed="embed" />
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import GenericEmbed from "./GenericEmbed.vue";
import ImageEmbed from "./ImageEmbed.vue";
import YoutubeEmbed from "./YoutubeEmbed.vue";
import TenorEmbed from "./TenorEmbed.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "EmbedMessage",
  components: { GenericEmbed, ImageEmbed, YoutubeEmbed, TenorEmbed },
  props: {
    embed: {
      type: Object as PropType<Embed>,
      required: true,
    },
  },
  computed: {
    tenorEmbed() {
      return this.embed.type === "tenor";
    },
    youtubeEmbed(): any {
      if (this.embed.site_name !== "YouTube") return false;
      if (this.embed.type !== "video.other") return false;
      const regex =
        /((http(s)?:\/\/)?)(www\.)?((youtube\.com\/)|(youtu.be\/))[\S]+/gm;
      if (!this.embed.url.match(regex)) return false;
      return true;
    },
    imageEmbed(): any {
      if (Object.keys(this.embed).length !== 1) return undefined;
      if (!this.embed.image) return undefined;
      return this.embed.image;
    },
  },
});
</script>
<style lang="scss" scoped>
.message-embed {
  flex-shrink: 0;
  margin-left: 56px;
  margin-top: 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);
  align-self: flex-start;
  overflow: hidden;
  max-width: 100%;
}

.message-embed.image {
  background: transparent;
}
</style>
