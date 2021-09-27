<template>
  <div class="html-profile">
    <InformationTemplate
      title="HTML Profile"
      information="Add custom HTML near the top of your profile popout."
    />
    <CustomButton
      icon="code"
      name="Edit HTML"
      class="button"
      v-if="!showEditor"
      @click="showEditor = !showEditor"
    />
    <CustomInput
      class="editor"
      v-if="showEditor"
      title="HTML Code"
      v-model="htmlCode"
      :textArea="true"
      :error="error"
    />
    <div class="buttons" v-if="showEditor">
      <CustomButton
        icon="save"
        name="Save"
        class="button"
        @click="updateHtml"
        :disabled="pendingRequest"
      />
      <CustomButton
        icon="close"
        name="Cancel"
        class="button"
        :warn="true"
        @click="cancelButton"
        :disabled="pendingRequest"
      />
      <CustomButton
        icon="delete"
        name="Delete"
        class="button"
        :alert="true"
        :disabled="pendingRequest"
        @click="deleteButton"
      />
    </div>
  </div>
</template>
<script lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import {
  deleteHtmlProfile,
  editHtmlProfile,
  getHtmlProfile,
  jsonHtml,
} from "@/services/userService";
import { defineComponent } from "vue";
export default defineComponent({
  components: { CustomButton, InformationTemplate, CustomInput },
  data() {
    return {
      htmlCode: "",
      showEditor: false,
      error: null as null | string,
      pendingRequest: false,
      defaultCode:
        '<div class="profile">\nHTML Profile\n</div>\n\n<style>\n.profile{\ncolor: blue;\n}\n</style>',
    };
  },
  mounted() {
    this.fetchCode();
  },
  methods: {
    async fetchCode() {
      this.pendingRequest = true;
      await getHtmlProfile()
        .then((res) => {
          const arr = Array.isArray(res) ? res : [res];

          let finalString = "";
          for (let index = 0; index < arr.length; index++) {
            const json = arr[index];
            finalString += this.jsonToHtml(json) + "\n\n";
          }
          this.htmlCode = finalString;
        })
        .catch(() => {
          this.htmlCode = this.defaultCode;
        })
        .finally(() => {
          this.pendingRequest = false;
        });
    },
    async cancelButton() {
      await this.fetchCode();
      this.showEditor = false;
    },
    deleteButton() {
      this.pendingRequest = true;
      deleteHtmlProfile()
        .then(() => {
          this.showEditor = false;
          this.htmlCode = this.defaultCode;
        })
        .finally(() => {
          this.pendingRequest = false;
        });
    },
    jsonToHtml(json: jsonHtml | string) {
      if (typeof json === "string") {
        return json;
      }
      let attr = "";
      for (let key in json.attributes) {
        const value = json.attributes[key];
        attr += ` ${key}="${value}"`;
      }
      let html = `<${json.tag}${attr}>\n${json.content
        .map((c) => this.jsonToHtml(c))
        .join("\n")}\n</${json.tag}>`;
      return html;
    },
    updateHtml() {
      if (this.pendingRequest) return;
      this.pendingRequest = true;
      this.error = null;
      editHtmlProfile(this.htmlCode)
        .then(() => {
          this.showEditor = false;
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = "Could not connect to server.";
            return;
          }
          const { error } = await err.response.json();
          this.error = error;
        })
        .finally(() => {
          this.pendingRequest = false;
        });
    },
  },
});
</script>

<style scoped lang="scss">
.html-profile {
  margin-left: 15px;
  margin-right: 10px;
}
.button {
  align-self: flex-start;
  margin-top: 10px;
}
.editor {
  margin-top: 10px;
  margin-bottom: -15px;
}
.buttons {
  display: flex;
}
</style>
