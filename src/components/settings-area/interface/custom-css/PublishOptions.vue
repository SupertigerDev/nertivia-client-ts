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
      <div class="error" v-if="errors['other']">{{ errors["other"] }}</div>
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
      <CustomInput
        title="Description"
        :textArea="true"
        :error="errors['description']"
        v-model="description"
      />
      <CustomButton
        v-if="publicTheme === undefined"
        style="align-self: flex-start"
        icon="public"
        :name="requestSent ? 'Publishing...' : 'Publish'"
        @click="publishForReview"
      />
      <CustomButton
        v-if="publicTheme"
        style="align-self: flex-start"
        icon="public"
        :name="requestSent ? 'Updating...' : 'Update'"
        @click="updatePublicTheme"
      />
      <CustomButton
        style="align-self: flex-start"
        icon="navigate_before"
        name="Back"
        @click="$emit('back')"
        :alert="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  addPublicTheme,
  getPublicTheme,
  PublicTheme,
  updatePublicTheme,
} from "@/services/exploreService";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { Theme } from "@/services/themeService";
import InformationTemplate from "@/components/InformationTemplate.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "PublishOptions",
  components: { CustomButton, CustomInput, InformationTemplate },
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  data() {
    return {
      publicTheme: null as null | undefined | PublicTheme,
      newImage: null as null | string,
      description: "",
      errors: {} as any,
      requestSent: false,
    };
  },
  computed: {
    imageURL(): any {
      if (this.newImage) return this.newImage;
      if (!this.publicTheme) return null;
      return `${process.env.VUE_APP_NERTIVIA_CDN}${this.publicTheme.screenshot}`;
    },
    status(): any {
      const themeVersion = this.theme.client_version;
      const lastBreakingVersion = this.$lastUIBreakingVersion;
      const isLatestPrivateTheme = themeVersion === lastBreakingVersion;
      if (this.publicTheme === undefined && !isLatestPrivateTheme)
        return "Nertivia had some UI breaking changes. Verify that the theme still works as intended and then click on save in the editor, then publish on this page.";
      if (this.publicTheme === undefined) return "Not Published";

      const publicThemeVersion = this.publicTheme?.compatible_client_version;
      const isLatestPublicTheme = publicThemeVersion === lastBreakingVersion;
      if (
        !themeVersion ||
        !publicThemeVersion ||
        !isLatestPublicTheme ||
        !isLatestPrivateTheme
      )
        return "Nertivia had some UI breaking changes. Verify that the theme still works as intended and then click on save in the editor, then update on this page.";

      if (this.publicTheme?.updatedCss) return "Waiting For Update Approval";
      if (!this.publicTheme?.approved) return "Waiting For Approval";
      if (this.publicTheme?.approved) return "Published";
      return "Unknown";
    },
  },
  async mounted() {
    this.publicTheme = await getPublicTheme(this.theme.id).catch(() => {
      this.publicTheme = undefined;
    });
    this.description = this.publicTheme?.description || "";
  },
  methods: {
    imageChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = (event) => {
        this.newImage = (event.target?.result as any) || null;
      };
      reader.readAsDataURL(file);
    },
    publishForReview() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.errors = {};
      const data: any = {};
      if (this.newImage) {
        data.screenshot = this.newImage;
      }
      data.description = this.description;
      addPublicTheme(this.theme.id, data)
        .then((json) => {
          this.publicTheme = json;
        })
        .catch(async (err) => {
          const json = await err.response.json();
          this.handleError(json);
        })
        .finally(() => {
          this.requestSent = false;
        });
    },
    updatePublicTheme() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.errors = {};
      const data: any = {};
      if (this.newImage) {
        data.screenshot = this.newImage;
      }
      data.description = this.description;
      updatePublicTheme(this.theme.id, data)
        .then((json) => {
          this.publicTheme = json;
        })
        .catch(async (err) => {
          const json = await err.response.json();
          this.handleError(json);
        })
        .finally(() => {
          this.requestSent = false;
        });
    },
    handleError(json: any) {
      const { errors, message } = json;
      if (message) {
        this.errors.other = message;
        return;
      }
      const allowedParams = ["description"];
      for (let i = 0; i < errors.length; i++) {
        const { param, msg } = errors[i];
        if (!allowedParams.includes(param)) {
          this.errors.other = msg;

          continue;
        }
        this.errors[param] = msg;
      }
    },
  },
});
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
.error {
  color: var(--alert-color);
  margin-left: 3px;
  margin-bottom: 5px;
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
