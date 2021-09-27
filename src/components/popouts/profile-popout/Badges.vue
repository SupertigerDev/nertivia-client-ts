<template>
  <div class="badges">
    <div class="title">{{ $t("profile-popout.badges") }}</div>
    <div class="list">
      <div
        class="badge"
        v-for="item in badges"
        :key="item.name"
        :style="{ borderColor: item.color }"
        :title="item.name"
      >
        <img :src="item.iconURL" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Badge } from "@/constants/badges";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Badges",
  props: {
    badges: {
      type: Array as PropType<Badge[]>,
      required: true,
    },
  },
});
</script>
<style scoped lang="scss">
.badges {
  flex-shrink: 0;
  margin: 3px;
  transition: 0.2s;
  cursor: default;
  user-select: none;
}
.list {
  display: flex;
  overflow: auto;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
}
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: solid 2px transparent;
  padding: 5px;
  height: 23px;
  width: 23px;
  img {
    height: 15px;
    width: 15px;
  }
}
</style>
