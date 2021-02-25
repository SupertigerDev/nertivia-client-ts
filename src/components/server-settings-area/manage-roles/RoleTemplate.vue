<template>
  <div class="role">
    <div class="color" :style="{ backgroundColor: role.color }" />
    <div class="name">{{ role.name }}</div>
    <div class="material-icons arrow">keyboard_arrow_right</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import ServerRole from "@/interfaces/ServerRole";

@Component({ components: { AvatarImage } })
export default class RoleTemplate extends Vue {
  @Prop() private role!: ServerRole;
}
</script>

<style lang="scss" scoped>
.role {
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
.color {
  height: 10px;
  width: 10px;
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
  margin-right: 10px;
}
.arrow {
  margin: auto;
  margin-right: 5px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.199);
}
</style>
