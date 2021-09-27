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
import Message from "@/interfaces/Message";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ImageMessageEmbed",
  props: {
    message: {
      type: Object as PropType<Message & { grouped: boolean }>,
      required: true,
    },
  },
  computed: {
    file(): any {
      return this.message.files?.[0];
    },
    url(): any {
      return `${process.env.VUE_APP_FETCH_PREFIX}/files/${this.file?.fileID}/${this.file?.fileName}`;
    },
  },
});
</script>

<style scoped lang="scss">
.file-message {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: var(--card-color);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
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
