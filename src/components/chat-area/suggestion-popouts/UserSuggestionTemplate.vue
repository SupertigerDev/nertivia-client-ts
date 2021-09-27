<template>
  <div class="user" :class="{ selected }">
    <AvatarImage
      class="avatar"
      :animateGif="selected"
      :imageId="item.avatar"
      :seedId="item.id"
      size="20px"
    />
    <div class="name">{{ item.username }}</div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import User from "@/interfaces/User";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserSuggestionTemplate",
  components: { AvatarImage },
  props: {
    item: {
      type: Object as PropType<User>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
<style scoped lang="scss">
.user {
  display: flex;
  align-items: center;
  align-content: center;
  height: 25px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.6);
  &.selected {
    background: var(--primary-color);
    color: white;
  }
}
.avatar {
  margin-right: 5px;
  margin-left: 5px;
}
.name {
  margin-right: 5px;
}
</style>
