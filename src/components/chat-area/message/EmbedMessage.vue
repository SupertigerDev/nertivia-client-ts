<template>
  <div class="message-embed">
    <GenericEmbed :embed="embed" />
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import GenericEmbed from "./GenericEmbed.vue";

@Component({ components: { GenericEmbed } })
export default class EmbedMessage extends Vue {
  @Prop() private embed!: Embed;
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
