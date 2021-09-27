<template>
  <div class="interface">
    <div class="box">
      <InformationTemplate
        title="Add bot commands to easily let users know which commands exist for your bot"
      />
      <div class="error" v-if="error">{{ error }}</div>
      <CustomInput
        title="Prefix"
        placeholder="e.g: !"
        prefixIcon="code"
        v-model="localBotPrefix"
        style="width: 100px; margin-top: 10px"
      />
      <CustomButton
        icon="add"
        class="button"
        :name="$t('settings.manage-bots.add-command-button')"
        :filled="true"
        @click="addButton"
      />
      <div class="commands-list">
        <div class="titles">
          <div class="title">Command</div>
          <div class="title">Arguments <span>(optional)</span></div>
        </div>
        <div class="list">
          <CommandTemplate
            v-for="(command, i) in localBotCommands"
            :key="command.id"
            :command="command"
            @change="commandChange(i, $event)"
            @delete="deleteCommand(i)"
          />
        </div>
      </div>
      <CustomButton
        icon="save"
        class="button"
        :name="!requestSent ? $t('save-changes') : $t('saving')"
        v-if="showSaveButton"
        :filled="true"
        @click="saveButton"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CommandTemplate from "./CommandTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import { updateBot } from "@/services/botService";
import User from "@/interfaces/User";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Account",
  components: {
    CustomButton,
    CustomInput,
    InformationTemplate,
    CommandTemplate,
  },
  props: {
    botCommands: {
      type: Array as PropType<any[]>,
      required: true,
    },
    botPrefix: {
      type: String,
      required: true,
    },
    bot: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      error: null as null | string,
      requestSent: false,
      localBotPrefix: this.botPrefix,
      localBotCommands: this.botCommands.map((c) => {
        return { ...c, id: Math.random() };
      }),
      showSaveButton: false,
    };
  },
  watch: {
    localBotPrefix: {
      handler: "onPrefixChange",
    },
  },
  methods: {
    commandChange(index: number, data: any) {
      this.showSaveButton = true;
      this.localBotCommands[index] = data;
    },
    deleteCommand(index: number) {
      this.showSaveButton = true;
      this.localBotCommands.splice(index, 1);
    },
    addButton() {
      this.showSaveButton = true;

      this.localBotCommands.unshift({
        c: "ban",
        a: "[@user][reason]//Ban A Member",
        id: Math.random(),
      });
    },
    saveButton() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      const commands = this.localBotCommands.map((cmd) => {
        return {
          c: cmd.c,
          a: cmd.a,
        };
      });
      updateBot(this.bot.id, {
        botPrefix: this.localBotPrefix,
        botCommands: commands,
      })
        .then(() => {
          this.showSaveButton = false;
          this.$emit("updated", {
            botPrefix: this.localBotPrefix,
            botCommands: commands,
          });
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const { errors, message } = await err.response.json();
          if (message) {
            this.error = message;
            return;
          }
          if (errors.length) {
            this.error = errors[0].msg;
          }
        })
        .finally(() => (this.requestSent = false));
    },
    onPrefixChange() {
      this.showSaveButton = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.commands-list {
  .titles {
    display: flex;
    .title {
      max-width: 200px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 5px;
      margin-right: 1px;
      span {
        opacity: 0.6;
        font-size: 14px;
      }
    }
  }
}
.button {
  align-self: flex-start;
}
.error {
  color: var(--alert-color);
}
</style>
