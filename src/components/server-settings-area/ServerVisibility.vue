<template>
  <div class="container">
    <!-- TODO: i18n -->
    <div class="description">
      <div class="material-icons">info</div>
      Make Your Server Public
    </div>
    <div class="notice">
      Making your server visibility public means that your server will be shown
      publicly in the Nertivia's "Explore" tab.
    </div>
    <div class="box" v-if="visibility !== null">
      <div class="title">Server Visibility</div>
      <div class="error">{{ error }}</div>
      <RadioBox :items="['Private', 'Public']" v-model="visibility" />
      <CustomInput
        :title="`Description`"
        v-if="visibility === 1"
        :textArea="true"
        :maxChars="150"
        v-model="description"
      />
      <CustomButton
        v-if="showSave"
        :disabled="updating"
        icon="save"
        name="Update"
        @click="update"
        :filled="true"
      />
      <CustomButton
        v-if="visibility === 1 && !response"
        :disabled="updating"
        icon="add"
        :name="$t('add-server-popout.title')"
        @click="addServer"
        :filled="true"
      />
      <CustomButton
        v-if="visibility === 0 && response"
        :disabled="updating"
        icon="delete"
        name="Make Private"
        @click="deleteServer"
        :alert="true"
        :filled="true"
      />
    </div>
  </div>
</template>
<script lang="ts">
import RadioBox from "@/components/RadioBox.vue";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import {
  addServer,
  deleteServer,
  getServer,
  ServerResponse,
  updateServer,
} from "@/services/exploreService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerVisibility",
  components: { RadioBox, CustomInput, CustomButton },
  data() {
    return {
      error: null as string | null,
      visibility: null as number | null,
      response: null as ServerResponse | null,
      description: "",
      updating: false,
    };
  },
  computed: {
    showSave(): any {
      if (!this.response) return false;
      if (this.description !== this.response?.description || "") return true;
      return false;
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      this.response = null;
      getServer(this.serverID)
        .then((server) => {
          this.visibility = 1;
          this.response = server;
          this.description = server.description || "";
        })
        .catch((err) => {
          this.visibility = null;
          if (!err.response) return;
          this.visibility = 0;
        });
    },
    deleteServer() {
      if (this.updating) return;
      this.error = null;
      this.updating = true;

      deleteServer(this.serverID)
        .then(() => {
          this.getDetails();
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const json = await err.response.json();
          this.error = json.message;
        })
        .finally(() => {
          this.updating = false;
        });
    },
    addServer() {
      if (this.updating) return;
      this.error = null;
      this.updating = true;

      addServer(this.serverID, this.description)
        .then(() => {
          this.getDetails();
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const json = await err.response.json();
          this.error = json.message;
        })
        .finally(() => {
          this.updating = false;
        });
    },
    update() {
      if (this.updating) return;
      this.error = null;
      this.updating = true;
      updateServer(this.serverID, this.description)
        .then(() => {
          this.getDetails();
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const json = await err.response.json();
          this.error = json.message;
        })
        .finally(() => {
          this.updating = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.error {
  color: var(--alert-color);
}
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.container {
  margin: 10px;
}

.box {
  margin-top: 10px;
  .input {
    max-width: 400px;
  }
}
.title {
  font-size: 18px;
  opacity: 0.7;
}
</style>
