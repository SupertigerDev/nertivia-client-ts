<template>
  <div class="container selected-bot-page">
    <TabLayout :tabs="tabs" @event="tabEvent" />

    <!-- <div class="tabs">
      <div class="tab" :class="{ selected: tab === 0 }" @click="tab = 0">
        <div class="material-icons icon">account_circle</div>
        {{ $t("settings.manage-bots.edit-bot") }}
      </div>
      <div class="tab" :class="{ selected: tab === 1 }" @click="tab = 1">
        <div class="material-icons icon">code</div>
        {{ $t("settings.manage-bots.edit-commands") }}
      </div>
    </div> -->
    <!-- <div class="content">
      <EditBot
        :bot="bot"
        :botToken="botToken"
        v-if="tab === 0"
        @tokenChanged="botToken = $event"
        @updated="$emit('updated', $event)"
        @deleted="$emit('deleted')"
      />
      <EditCommands
        :bot="bot"
        :botPrefix="botPrefix"
        :botCommands="botCommands"
        v-if="tab === 1"
        @updated="botCommandsUpdate"
      />
    </div> -->
    <CustomButton
      class="back-button"
      :name="$t('back')"
      :alert="true"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import EditBot from "./EditBot.vue";
import EditCommands from "./EditCommands.vue";

import User from "@/interfaces/User";
import { getBot } from "@/services/botService";
import TabLayout from "@/components/TabLayout.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageChannels",
  components: {
    TabLayout,
  },
  props: {
    bot: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      botToken: null as string | null,
      botPrefix: "",
      botCommands: [] as any[],
    };
  },
  computed: {
    tabs(): any {
      return [
        {
          id: "edit_bot",
          name: this.$t("settings.manage-bots.edit-bot"),
          component: EditBot,
          props: { bot: this.bot, botToken: this.botToken },
          events: ["tokenChanged", "updated", "deleted"],
        },
        {
          id: "edit_commands",
          name: this.$t("settings.manage-bots.edit-commands"),
          component: EditCommands,
          props: {
            bot: this.bot,
            botPrefix: this.botPrefix,
            botCommands: this.botCommands,
          },
          events: ["updated"],
        },
      ];
    },
  },
  mounted() {
    getBot(this.bot.id, true).then((json: any) => {
      this.botToken = json.token;
      this.botPrefix = json.botPrefix || "";
      this.botCommands = json.botCommands || [];
    });
  },
  methods: {
    tabEvent(event: { id: string; eventName: string; data: any }) {
      if (event.id === "edit_commands") {
        if (event.eventName === "updated") {
          this.botCommandsUpdate(event.data);
        }
      }
      if (event.id === "edit_bot") {
        if (event.eventName === "updated") {
          this.$emit("updated", event.data);
        }
        if (event.eventName === "deleted") {
          this.$emit("deleted");
        }
        if (event.eventName === "tokenChanged") {
          this.botToken = event.data;
        }
      }
    },
    botCommandsUpdate({ botCommands, botPrefix }) {
      this.botCommands = botCommands;
      this.botPrefix = botPrefix;
    },
  },
});
</script>

<style lang="scss" scoped>
.container.selected-bot-page {
  display: flex;
  flex-direction: column;
  margin: 5px;
  overflow: auto;
}

.back-button {
  align-self: flex-start;
}
</style>
