<template>
  <div class="status-list">
    <ContextMenu
      :items="items"
      :pos="pos"
      type="dot"
      @close="close"
      @itemClick="click"
    />
  </div>
</template>

<script lang="ts">
import ContextMenu from "@/components/ContextMenu.vue";
import userStatuses from "@/constants/userStatuses";
import { changeStatus } from "@/services/userService";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileCard",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{ x?: number; y?: number }>,
      required: true,
    },
  },
  computed: {
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y,
      };
    },
    items(): any {
      const invis = { ...userStatuses[0], name: "Invisible" };
      const [, ...all] = userStatuses;
      return [...all, { type: "seperator" }, invis];
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
    click(item: any) {
      let index = 0;
      if (item.name !== "Invisible") {
        index = userStatuses.findIndex((s) => s.name === item.name);
      }
      if (index < 0) return;
      changeStatus(index);
      this.$emit("close");
    },
  },
});
</script>
<style lang="scss" scoped></style>
