<template>
  <div class="item" :class="{ selected: showOptions }">
    <div class="name" @click="clicked">{{ theme.name }}</div>
    <div class="options" v-if="showOptions">
      <CustomButton name="Apply" icon="done" />
      <CustomButton name="Edit" icon="edit" />
      <div class="seperator" />
      <CustomButton name="Delete" :warn="true" icon="delete" />
    </div>
  </div>
</template>

<script lang="ts">
import { ThemeDetail } from "@/services/themeService";
import { Vue, Component, Prop } from "vue-property-decorator";
import CustomButton from "@/components/CustomButton.vue";

@Component({ components: { CustomButton } })
export default class ThemeTemplate extends Vue {
  @Prop() private theme!: ThemeDetail;
  showOptions = false;
  clicked() {
    this.showOptions = !this.showOptions;
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
  &.selected,
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
.name {
  flex-shrink: 0;
  padding: 5px;
}
.options {
  display: flex;
  align-items: center;
}
.seperator {
  height: 40px;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 5px;
  margin-right: 5px;
}
</style>
