<template>
  <div class="command">
    <input type="text" placeholder="e.g profile" v-model="localCommand" />
    <input
      type="text"
      placeholder="e.g [@user]//View Profile"
      v-model="localAction"
    />
    <div class="material-icons delete-button" @click="$emit('delete')">
      delete
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["change", "delete"],

  name: "CommandTemplate",
  props: {
    command: {
      type: Object as PropType<{ a: string; c: string; id: string }>,
      required: true,
    },
  },
  data() {
    return {
      localCommand: this.command.c,
      localAction: this.command.a,
    };
  },
  watch: {
    localCommand: {
      handler: "commandChange",
    },
    localAction: {
      handler: "actionChange",
    },
  },
  methods: {
    commandChange() {
      this.$emit("change", {
        a: this.localAction,
        c: this.localCommand,
        id: this.command.id,
      });
    },
    actionChange() {
      this.$emit("change", {
        a: this.localAction,
        c: this.localCommand,
        id: this.command.id,
      });
    },
  },
});
</script>

<style lang="scss">
.command {
  display: flex;
  input {
    max-width: 200px;
    width: 100%;
    padding: 5px;
    margin-right: 1px;
    outline: none;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0px;
  }
}
.delete-button {
  opacity: 0.6;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
</style>
