<template>
  <div class="publish-options" v-if="theme">
    <div class="info">
      <InformationTemplate
        title="Make your theme appear in the explore tab so others can use it."
      />
      <InformationTemplate
        title="To change the name, go to the edit page in custom CSS."
      />
      <InformationTemplate
        title="Only updating the CSS or publishing theme requires reviewing."
      />
    </div>
    <div class="box">
      <div class="status-container">
        <div class="title">Status:</div>
        <div class="status">{{ status }}</div>
      </div>
      <div class="avatar-banner" :class="{ noBanner: !imageURL }">
        <div class="banner-container">
          <img class="banner" v-if="imageURL" :src="imageURL" />
          <div
            title="Edit Banner"
            class="material-icons edit-button banner-edit"
            @click="$refs.imageInput.click()"
          >
            edit
          </div>
        </div>

        <input
          ref="imageInput"
          style="display: none"
          type="file"
          accept=".jpeg, .jpg, .png, .gif"
          @change="imageChange"
        />
      </div>

      <CustomInput :value="theme.name" title="Name" :disabled="true" />
      <CustomInput title="Description" :textArea="true" value="test" />
      <CustomButton
        v-if="publicTheme === undefined"
        style="align-self: flex-start"
        icon="public"
        name="Publish"
        @click="$emit('back')"
      />
      <CustomButton
        v-if="publicTheme"
        style="align-self: flex-start"
        icon="public"
        name="Update"
        @click="$emit('back')"
      />
      <CustomButton
        style="align-self: flex-start"
        icon="navigate_before"
        name="Back"
        @click="$emit('back')"
        :warn="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getPublicTheme, PublicTheme } from "@/services/exploreService";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { Theme } from "@/services/themeService";
import InformationTemplate from "@/components/InformationTemplate.vue";

@Component({ components: { CustomButton, CustomInput, InformationTemplate } })
export default class PublishOptions extends Vue {
  @Prop() private theme!: Theme;
  publicTheme?: null | PublicTheme = null;
  newImage: null | string = null;
  async mounted() {
    this.publicTheme = await getPublicTheme(this.theme.id).catch(() => {
      this.publicTheme = undefined;
    });
  }
  imageChange(event: any) {
    const file: File = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = event => {
      this.newImage = (event.target?.result as any) || null;
    };
    reader.readAsDataURL(file);
  }

  get imageURL() {
    if (this.newImage) return this.newImage;
    if (!this.publicTheme) return null;
    return `${process.env.VUE_APP_FETCH_PREFIX}/media/${this.publicTheme.screenshot}`;
  }
  get status() {
    if (this.publicTheme === undefined) return "Not Published";
    if (this.publicTheme?.compatible_version !== this.$LastUIBreakingVersion)
      return "Nertivia had some UI breaking changes. Verify that the theme still works as intended and then click on update.";
    if (this.publicTheme?.approved) return "Published";
    if (!this.publicTheme?.approved) return "Waiting For Approval";
    return "Unknown";
  }
}
</script>

<style lang="scss" scoped>
.publish-options {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.menu-strip {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}
.info {
  margin: 10px;
}
.box {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 10px;
}
.info div {
  margin-top: 5px;
  opacity: 0.7;
}
.status-container {
  background: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 20px;
  .title {
    font-weight: bold;
  }
  .status {
    opacity: 0.8;
  }
}
.avatar-banner {
  height: 170px;
  width: 100%;
  max-width: 500px;
  position: relative;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  .banner-container {
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  .banner {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: relative;
  }
  &.noBanner::before {
    content: "Image Required";
    font-size: 24px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .edit-button {
    cursor: pointer;
    user-select: none;
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    background: var(--primary-color);
    font-size: 18px;
    transition: 0.2s;
    padding: 5px;
    &.banner-edit {
      top: -10px;
      right: -10px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
