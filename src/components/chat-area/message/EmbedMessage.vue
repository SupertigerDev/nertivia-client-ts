<template>
  <div class="message-embed">
    <ImageEmbed v-if="imageEmbed" :image="imageEmbed" />
    <GenericEmbed v-else :embed="embed" />
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import GenericEmbed from "./GenericEmbed.vue";
import ImageEmbed from "./ImageEmbed.vue";

@Component({ components: { GenericEmbed, ImageEmbed } })
export default class EmbedMessage extends Vue {
  @Prop() private embed!: Embed;

  get imageEmbed() {
    if (Object.keys(this.embed).length !== 1) return undefined;
    if (!this.embed.image) return undefined;
    return this.embed.image;
  }
}
</script>
<style lang="scss" scoped>
.message-embed {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-left: 50px;
  margin-top: 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);
  align-self: flex-start;
  overflow: hidden;
}
</style>
