<template>
  <div class="item" :class="{ selected: showOptions, applied }">
    <div class="name" @click="$emit('clicked')">
      {{ theme.name }} <span class="notice" v-if="applied">(In use)</span>
    </div>
    <div class="options" :class="{ show: showOptions }">
      <CustomButton
        name="Publish"
        @click="$emit('publish', theme.id)"
        icon="public"
      />
      <CustomButton
        name="Apply"
        @click="apply"
        v-if="!applied"
        icon="done"
        :valid="true"
      />
      <CustomButton
        name="Unapply"
        @click="unapply"
        v-else
        icon="close"
        :alert="true"
      />
      <CustomButton name="Edit" icon="edit" @click="$emit('edit')" />
      <div class="seperator" />
      <CustomButton
        name="Delete"
        @click="$emit('delete', theme.id)"
        :alert="true"
        icon="delete"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ThemePreview } from "@/services/themeService";
import CustomButton from "@/components/CustomButton.vue";
import { applyTheme, unapplyTheme } from "@/utils/CSSTheme";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ThemeTemplate",
  components: { CustomButton },
  props: {
    theme: {
      type: Object as PropType<ThemePreview>,
      required: true,
    },
    showOptions: {
      type: Boolean,
      default: false,
    },
    applied: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    apply() {
      applyTheme(this.theme.id);
      this.$emit("applied");
    },
    unapply() {
      unapplyTheme();
      this.$emit("unapplied");
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
  &.applied,
  &.selected,
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
.notice {
  opacity: 0.6;
  font-size: 12px;
}
.name {
  flex-shrink: 0;
  padding: 5px;
}
.options {
  display: flex;
  align-items: center;
  height: 0;
  overflow: hidden;
  transition: 0.2s;
  opacity: 0;
  &.show {
    opacity: 1;
    height: 50px;
  }
}
.seperator {
  height: 40px;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 5px;
  margin-right: 5px;
}
</style>
