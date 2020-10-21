<template>
  <div class="status-list">
    <ContextMenu
      :items="items"
      :pos="pos"
      type="dot"
      @close="$emit('close')"
      @itemClick="click"
    />
  </div>
</template>

<script lang="ts">
import ContextMenu from "@/components/ContextMenu.vue";
import userStatuses from "@/constants/userStatuses";
import { Vue, Component, Prop } from "vue-property-decorator";
import { changeStatus } from "@/services/userService";

@Component({ components: { ContextMenu } })
export default class ProfileCard extends Vue {
  @Prop() private pos!: { x?: number; y?: number };
  click(item: any) {
    let index = 0;
    if (item.name !== "Invisible") {
      index = userStatuses.findIndex(s => s.name === item.name);
    }
    if (index < 0) return;
    changeStatus(index);
    this.$emit("close");
  }

  get items() {
    const invis = { ...userStatuses[0], name: "Invisible" };
    const [, ...all] = userStatuses;
    return [...all, { type: "seperator" }, invis];
  }
}
</script>
<style lang="scss" scoped></style>
