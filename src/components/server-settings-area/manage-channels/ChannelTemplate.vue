<template>
  <div class="channel">
    {{ channel.name }}
    <div class="material-icons arrow">keyboard_arrow_right</div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import Channel from "@/interfaces/Channel";
import Vue, { PropType } from "vue";
export default Vue.extend({
  name: "InviteTemplate",
  components: { AvatarImage },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: false
    }
  }
});
</script>

<style lang="scss" scoped>
.channel {
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
.arrow {
  margin: auto;
  margin-right: 5px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.199);
}
</style>
