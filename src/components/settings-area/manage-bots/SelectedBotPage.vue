<template>
  <div class="container selected-bot-page">
    <div class="tabs">
      <div class="tab" :class="{ selected: tab === 0 }" @click="tab = 0">
        <div class="material-icons icon">account_circle</div>
        Edit Bot
      </div>
      <div class="tab" :class="{ selected: tab === 1 }" @click="tab = 1">
        <div class="material-icons icon">code</div>
        Edit Commands
      </div>
    </div>
    <div class="content">
      <EditBot
        :bot="bot"
        :botToken="botToken"
        @tokenChanged="botToken = $event"
        v-if="tab === 0"
        @updated="$emit('updated', $event)"
        @deleted="$emit('deleted')"
      />
      <div v-if="tab === 1">Work In Progress!</div>
    </div>
    <CustomButton
      class="back-button"
      name="Back"
      :warn="true"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import EditBot from "./EditBot.vue";
import CheckBox from "@/components/CheckBox.vue";
import User from "@/interfaces/User";
import { getBot } from "@/services/botService";
@Component({
  components: { CustomInput, CustomButton, CheckBox, EditBot }
})
export default class ManageChannels extends Vue {
  @Prop() private bot!: User;
  botToken: string | null = null;
  mounted() {
    getBot(this.bot.uniqueID, true).then((json: any) => {
      this.botToken = json.token;
    });
  }
  tab = 0;
}
</script>

<style lang="scss" scoped>
.container.selected-bot-page {
  display: flex;
  flex-direction: column;
  margin: 5px;
  overflow: auto;
}
.content {
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  flex: 1;
  border-radius: 4px;
  padding: 10px;
  overflow: auto;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 160px;
    margin-top: 5px;
    margin-bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    cursor: pointer;
    user-select: none;
    height: 30px;
    opacity: 0.6;
    transition: 0.2s;
    .icon {
      margin-right: 5px;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.05);
      opacity: 1;
    }
    &.selected {
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
.back-button {
  align-self: flex-start;
}
</style>
