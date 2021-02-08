<template>
  <div class="generic-embed">
    <img class="image" v-if="imageUrl" :src="imageUrl" alt="" />
    <div class="details">
      <a :href="url" target="_blank" rel="noopener noreferrer">{{ title }}</a>
      <div class="description">{{ embed.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import config from "@/config";

@Component
export default class GenericEmbed extends Vue {
  @Prop() private embed!: Embed;

  get imageUrl() {
    if (!this.embed.image?.url) return undefined;
    return config.image_proxy + encodeURIComponent(this.embed.image.url);
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
.generic-embed {
  display: flex;
  flex-shrink: 0;
  height: 100px;
  max-width: 500px;
}
.image {
  height: 100px;
  width: 100px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  object-fit: cover;
  margin-right: 5px;
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
