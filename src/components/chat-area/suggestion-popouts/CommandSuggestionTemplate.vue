<template>
  <div class="command" :class="{ selected: isSelected }">
    <div class="top">
      <div class="material-icons icon">code</div>
      <div class="name">{{ item.command.c }}</div>
      <div class="args">
        <div
          class="arg"
          v-for="(arg, i) in args"
          :key="i"
          :class="{ warn: !arg.typed }"
        >
          {{ arg.name }}
        </div>
      </div>
    </div>
    <div class="details" v-if="commandInfo">
      {{ commandInfo }}
    </div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import { BotCommand } from "@/store/modules/botCommands";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CommandSuggestionTemplate",
  props: {
    selected: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object as PropType<{
        command: BotCommand;
        bot: User;
        argsEnteredLength: number;
      }>,
      required: true,
    },
  },
  computed: {
    commandInfo(): any {
      return this.item.command.a.split("//")[1];
    },
    args(): any {
      const regex = /\[(.*?)\]/gm;
      const argNames = this.item.command.a.match(regex);
      if (!argNames) return [];
      return argNames.map((v, i) => {
        return {
          name: v,
          typed: this.item.argsEnteredLength - 1 >= i,
        };
      });
    },
    isSelected(): any {
      if (this.args.find((a) => a.typed)) return false;
      return this.selected;
    },
  },
});
</script>
<style scoped lang="scss">
.command {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.6);
  &.selected {
    background: var(--primary-color);
    color: white;
    .dot {
      background: white;
    }
  }
  .top {
    display: flex;
    align-items: center;
    align-content: center;
  }
}
.details {
  font-size: 14px;
  opacity: 0.8;
  margin-left: 27px;
  margin-right: 5px;
}

.args {
  margin-right: 5px;
  display: flex;
  font-size: 14px;
  .arg {
    margin-left: 3px;
    color: var(--success-color);
    &.warn {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
.icon {
  font-size: 18px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>
