<template>
  <div class="container">
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
        :title="`Description (${chars}/150)`"
        v-if="visibility === 1"
        :textArea="true"
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
        name="Add Server"
        @click="addServer"
        :filled="true"
      />
      <CustomButton
        v-if="visibility === 0 && response"
        :disabled="updating"
        icon="delete"
        name="Delete Server"
        @click="deleteServer"
        :warn="true"
        :filled="true"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import RadioBox from "@/components/RadioBox.vue";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import {
  addServer,
  deleteServer,
  getServer,
  ServerResponse,
  updateServer
} from "@/services/exploreService";
@Component({ components: { RadioBox, CustomInput, CustomButton } })
export default class ServerVisibility extends Vue {
  error: string | null = null;
  visibility: number | null = null;
  response: ServerResponse | null = null;
  description = "";
  updating = false;
  mounted() {
    this.getDetails();
  }
  getDetails() {
    this.response = null;
    getServer(this.serverID)
      .then(server => {
        this.visibility = 1;
        this.response = server;
        this.description = server.description || "";
      })
      .catch(err => {
        this.visibility = null;
        if (!err.response) return;
        this.visibility = 0;
      });
  }
  deleteServer() {
    if (this.updating) return;
    this.error = null;
    this.updating = true;

    deleteServer(this.serverID)
      .then(() => {
        this.getDetails();
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const json = await err.response.json();
        this.error = json.message;
      })
      .finally(() => {
        this.updating = false;
      });
  }
  addServer() {
    if (this.updating) return;
    this.error = null;
    this.updating = true;

    addServer(this.serverID, this.description)
      .then(() => {
        this.getDetails();
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const json = await err.response.json();
        this.error = json.message;
      })
      .finally(() => {
        this.updating = false;
      });
  }
  update() {
    if (this.updating) return;
    this.error = null;
    this.updating = true;
    updateServer(this.serverID, this.description)
      .then(() => {
        this.getDetails();
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const json = await err.response.json();
        this.error = json.message;
      })
      .finally(() => {
        this.updating = false;
      });
  }

  get showSave() {
    if (!this.response) return false;
    if (this.description !== this.response?.description || "") return true;
    return false;
  }
  get chars() {
    return this.description.length;
  }

  get serverID() {
    return this.$route.params.server_id;
  }
}
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
