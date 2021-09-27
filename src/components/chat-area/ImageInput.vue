<template>
  <div class="file" :class="{ mobile: parentWidth < 470 }" :style="{ width }">
    <div class="image-container"><div class="image" ref="image" /></div>
    <div class="details">
      <div class="name">{{ name }}</div>
      <div class="size">{{ sizeLabel }}</div>
      <CheckBox
        :name="$t('upload-dialog.compress')"
        v-model="compress"
        @change="onToggleCompress"
      />
      <div class="title">{{ $t("upload-dialog.upload-to") }}:</div>
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
import fileSize from "filesize";
import CheckBox from "@/components/CheckBox.vue";
import RadioBox from "@/components/RadioBox.vue";
import { MeModule } from "@/store/modules/me";
import { PopoutsModule } from "@/store/modules/popouts";
import { useWindowProperties } from "@/utils/windowProperties";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { CheckBox, RadioBox },
  data() {
    return {
      messageLogsEl: null as HTMLElement | null,
      width: "450px",
    };
  },
  computed: {
    file(): File | undefined {
      return FileUploadModule.file.file;
    },
    exceedCDNMaxSize(): any {
      const maxCDNSize = 7340000;
      return (this.file?.size || 0) > maxCDNSize;
    },
    name(): any {
      return this.file?.name;
    },
    sizeLabel(): any {
      return fileSize(this.size);
    },
    size(): any {
      return this.file?.size || 0;
    },
    compress: {
      get(): any {
        return FileUploadModule.compress;
      },
      set(val: boolean) {
        FileUploadModule.SetCompress(val);
      },
    },
    cdn: {
      get(): any {
        return FileUploadModule.cdn;
      },
      set(val: number) {
        FileUploadModule.SetCDN(val);
      },
    },
    parentWidth(): any {
      // this line is needed to make this getter reactive.
      const windowWidth = useWindowProperties().resizeWidth;

      return this.messageLogsEl?.clientWidth || 0;
    },
  },
  watch: {
    parentWidth: {
      handler: "onParentWidthChange",
    },
  },
  mounted() {
    // set image preview
    const reader = new FileReader();
    const image = this.$refs.image as any;
    reader.onloadend = function () {
      image.style.backgroundImage = `url(${reader.result})`;
    };
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    this.messageLogsEl = document.getElementById("messageLogs");
  },
  methods: {
    onToggleCompress(val: boolean) {
      if (!val && this.exceedCDNMaxSize && this.cdn === 1) {
        alert(
          "Nertivia CDN Max file size: 7MB. \nEither compress the image or upload using Google Drive option."
        );
        FileUploadModule.SetCompress(true);
      }
    },
    onRadioIndexChange(val: number) {
      if (val === 0 && !MeModule.user.googleDriveLinked) {
        this.cdn = 1;
        PopoutsModule.ShowPopout({
          id: "link-google-drive",
          component: "LinkGoogleDrive",
        });
        return;
      }
      if (val === 1 && this.exceedCDNMaxSize) {
        FileUploadModule.SetCompress(true);
      }
    },
    onParentWidthChange() {
      if (!this.parentWidth) return;
      if (this.parentWidth < 470) {
        this.width = this.parentWidth - 15 + "px";
        return;
      }
      this.width = "450px";
    },
  },
});
</script>

<style lang="scss" scoped>
.details {
  overflow: hidden;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.file {
  display: flex;
  align-items: center;
  height: 100%;
  &.mobile {
    flex-direction: column;
    .image-container {
      width: 100%;
    }
    .details {
      align-self: flex-start;
    }
  }
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
