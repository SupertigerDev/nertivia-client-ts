<template>
  <div class="generic-embed">
    <div class="image-outer" v-if="imageUrl">
      <img class="image" @click="imageClick" :src="imageUrl" alt="" />
    </div>
    <div class="details">
      <a
        :href="url"
        @click="urlClick"
        target="_blank"
        rel="noopener noreferrer"
        >{{ title }}</a
      >
      <div class="description">{{ embed.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Embed } from "@/interfaces/Message";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "GenericEmbed",
  props: {
    embed: {
      type: Object as PropType<Embed>,
      required: true,
    },
  },
  computed: {
    imageUrl(): any {
      if (!this.embed.image?.url) return undefined;
      return (
        process.env.VUE_APP_IMAGE_PROXY_URL +
        encodeURIComponent(this.embed.image.url)
      );
    },
    title(): any {
      return this.embed.title || this.embed.site_name;
    },
    url(): any {
      const url = this.embed.url;
      if (!url) return "#";
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return `https://${url}`;
    },
  },
  methods: {
    imageClick() {
      PopoutsModule.ShowPopout({
        id: "image-preview-popout",
        component: "image-preview-popout",
        data: {
          url: this.imageUrl,
          unsafe_url: this.embed?.image?.url,
          dimensions: this.embed.image?.dimensions,
        },
      });
    },
    urlClick(event) {
      event.preventDefault();
      PopoutsModule.ShowPopout({
        id: "html-embed-url-sus",
        component: "OpenLinkConfirm",
        data: { url: this.url },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.generic-embed {
  display: flex;
  flex-shrink: 0;
  height: 100px;
  max-width: 500px;
}
.image-outer {
  height: 100px;
  width: 100px;
  flex-shrink: 0;
  margin-right: 5px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    border-radius: 4px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
  }
}
.image {
  height: 100px;
  width: 100px;
  background: rgba(0, 0, 0, 0.5);
  object-fit: cover;
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
