<template>
  <div class="file-message">
    <div class="material-icons icon">insert_drive_file</div>
    <div class="name">{{ file.fileName }}</div>
    <a :href="url" target="_blank" rel="noopener noreferrer">
      <div class="material-icons download-button">download</div>
    </a>
  </div>
</template>

<script lang="ts">
import config from "@/config";
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ImageMessageEmbed extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  get file() {
    return this.message.files?.[0];
  }
  get url() {
    return `${config.fetchPrefix}/files/${this.file?.fileID}/${this.file?.fileName}`;
  }
}
</script>

<style scoped lang="scss">
.file-message {
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.4);
  padding: 5px;
}
.icon {
  margin-right: 5px;
  font-size: 40px;
}
.name {
  opacity: 0.6;
}
.download-button {
  border-radius: 50%;
  padding: 4px;
  font-size: 21px;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  &:hover {
    background: var(--primary-color);
  }
}
a {
  color: white;
  text-decoration: none;
}
</style>
