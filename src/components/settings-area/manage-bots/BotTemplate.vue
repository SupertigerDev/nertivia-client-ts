<template>
  <div class="bot">
    <AvatarImage
      class="avatar"
      :imageId="bot.avatar"
      :seedId="bot.id"
      size="30px"
    />
    <span class="username">{{ bot.username }}</span>
    <span class="tag">:{{ bot.tag }}</span>
    <div class="material-icons arrow">keyboard_arrow_right</div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import User from "@/interfaces/User";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "InviteTemplate",
  components: { AvatarImage },
  props: {
    bot: {
      type: Object as PropType<User>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.bot {
  display: flex;
  padding: 5px;
  border-radius: 4px;
  align-items: center;
  align-content: center;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    .arrow {
      color: white;
    }
  }
}
.avatar {
  margin-right: 5px;
}

.tag {
  color: rgba(255, 255, 255, 0.4);
}
.arrow {
  margin: auto;
  margin-right: 5px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.199);
}
</style>
