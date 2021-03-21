<template>
  <div class="youtube-embed">
    <VideoPlayer :thumbnailURL="imageURL" :youtubeURL="embed.url" />
    <div class="details">
      <a :href="url" target="_blank" rel="noopener noreferrer">{{ title }}</a>
      <div class="description">{{ embed.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import VideoPlayer from "./VideoPlayer.vue";

@Component({ components: { VideoPlayer } })
export default class YoutubeEmbed extends Vue {
  @Prop() private embed!: Embed;

  get imageURL() {
    if (!this.embed.image?.url) return undefined;
    return (
      process.env.VUE_APP_IMAGE_PROXY_URL +
      encodeURIComponent(this.embed.image.url)
    );
  }
  get title() {
    return this.embed.title || this.embed.site_name;
  }
  get url() {
    const url = this.embed.url;
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  }
}
</script>
<style lang="scss" scoped>
.youtube-embed {
  display: flex;
  flex-shrink: 0;
  display: table-caption;
}

.details {
  margin: 5px;
  .description {
    color: rgba(255, 255, 255, 0.6);
    margin-top: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
