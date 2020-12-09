<template>
  <div class="file">
    <div class="image-container"><div class="image" ref="image" /></div>
    <div class="details">
      <div class="name">{{ name }}</div>
      <div class="size">{{ sizeLabel }}</div>
      <CheckBox name="Compress" v-model="compress" @change="onToggleCompress" />
      <div class="title">Upload To:</div>
      <RadioBox
        :items="['Google Drive', 'Nertivia CDN']"
        @change="onRadioIndexChange"
        v-model="cdn"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import { Component, Vue } from "vue-property-decorator";
import fileSize from "filesize";
import CheckBox from "@/components/CheckBox.vue";
import RadioBox from "@/components/RadioBox.vue";

@Component({ components: { CheckBox, RadioBox } })
export default class MainApp extends Vue {
  mounted() {
    // set image preview
    const reader = new FileReader();
    const image = this.$refs.image as any;
    reader.onloadend = function() {
      image.style.backgroundImage = `url(${reader.result})`;
    };
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
  }
  onToggleCompress(val: boolean) {
    if (!val && this.exceedCDNMaxSize && this.cdn === 1) {
      alert(
        "Nertivia CDN Max file size: 7MB. \nEither compress the image or upload using Google Drive option."
      );
      FileUploadModule.SetCompress(true);
    }
  }
  onRadioIndexChange(val: number) {
    if (val === 1 && this.exceedCDNMaxSize) {
      FileUploadModule.SetCompress(true);
    }
  }
  get exceedCDNMaxSize() {
    const maxCDNSize = 7340000;
    return (this.file?.size || 0) > maxCDNSize;
  }
  get name() {
    return this.file?.name;
  }
  get sizeLabel() {
    return fileSize(this.size);
  }
  get size() {
    return this.file?.size || 0;
  }
  get file() {
    return FileUploadModule.file.file;
  }
  get compress() {
    return FileUploadModule.compress;
  }
  set compress(val) {
    FileUploadModule.SetCompress(val);
  }
  get cdn() {
    return FileUploadModule.cdn;
  }
  set cdn(val) {
    FileUploadModule.SetCDN(val);
  }
}
</script>

<style lang="scss" scoped>
.details {
  overflow: hidden;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.file {
  display: flex;
  align-items: center;
  height: 100%;
  width: 450px;
  min-width: 400px;
}
.image-container {
  height: 172px;
  width: 255px;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.3);
  .image {
    height: 100%;
    width: 100%;
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: pre-wrap;
}
.title {
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
}
.size {
  opacity: 0.5;
}
</style>
