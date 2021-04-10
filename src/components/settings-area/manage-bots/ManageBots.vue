<template>
  <div class="container manage-bots">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        Manage Bots
      </div>
      <div class="notice">
        Create bot users which will allow you to use our API to create your own
        fancy bots.
      </div>

      <SelectedBotPage
        v-if="bots && selectedBotIndex >= 0"
        :bot="bots[selectedBotIndex]"
        @close="selectedBotIndex = -1"
        @updated="botUpdated"
        @deleted="botDeleted"
      />
      <div class="box" v-if="selectedBotIndex === -1">
        <CustomButton
          class="button"
          name="Create Bot"
          icon="add"
          @click="createBot"
        />
        <div class="bot-count">
          Bots: <span>{{ !bots ? 0 : bots.length }}/5</span>
        </div>
        <div class="bot-list" v-if="bots">
          <BotTemplate
            v-for="(bot, i) in bots"
            :key="bot.id"
            :bot="bot"
            @click.native="selectedBotIndex = i"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SelectedBotPage from "./SelectedBotPage.vue";
import BotTemplate from "./BotTemplate.vue";
import User from "@/interfaces/User";
import { createBot, getBots } from "@/services/botService";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: {
    CustomInput,
    CustomButton,
    SelectedBotPage,
    BotTemplate
  }
})
export default class ManageChannels extends Vue {
  showContext = false;
  selectedBotIndex = -1;
  createRequestSent = false;
  bots: User[] | null = null;
  botUpdated(data) {
    if (!this.bots) return;
    const bot = this.bots[this.selectedBotIndex];
    if (!bot) return;
    this.$set(this.bots, this.selectedBotIndex, { ...bot, ...data });
  }
  botDeleted() {
    if (!this.bots) return;
    this.$delete(this.bots, this.selectedBotIndex);
    this.selectedBotIndex = -1;
  }
  createBot() {
    if (this.createRequestSent) return;
    this.createRequestSent = true;
    createBot()
      .then(bot => {
        this.bots?.unshift(bot);
        this.selectedBotIndex = 0;
      })
      .catch(async err => {
        PopoutsModule.ShowPopout({
          id: "error",
          component: "generic-popout",
          data: {
            title: "Error Creating Bot",
            description: !err.response
              ? "Could not connect to server."
              : (await err.response.json()).message
          }
        });
      })
      .finally(() => (this.createRequestSent = false));
  }
  mounted() {
    getBots().then(bot => {
      this.bots = bot.reverse();
    });
  }
}
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0;
}
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 10px;
  margin-top: 10px;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 40px;
}

.bot-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 10px;
}
.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.button {
  align-self: flex-start;
  border: none;
  color: white;
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.03);
}
.bot-count {
  margin-left: 10px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  span {
    color: white;
  }
}
</style>
