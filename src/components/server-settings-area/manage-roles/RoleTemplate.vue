<template>
  <div
    class="role"
    v-if="role"
    :class="{ disabled: !role.canModify && !role.default }"
  >
    <div class="color" :style="{ backgroundColor: role.color }" />
    <div class="name">{{ role.name }}</div>
    <div class="info" v-if="role.bot">
      {{ $t("server-settings.manage-roles.bot-role") }}
    </div>
    <div class="info" v-if="role.default">
      {{ $t("server-settings.manage-roles.default-role") }}
    </div>
    <div class="material-icons arrow">keyboard_arrow_right</div>
  </div>
</template>
<script lang="ts">
import ServerRole from "@/interfaces/ServerRole";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "RoleTemplate",
  props: {
    role: {
      type: Object as PropType<ServerRole & { canModify: boolean }>,
      required: true,
    },
  },
});
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
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: initial;
      color: rgba(255, 255, 255, 0.7);
      .arrow {
        color: rgba(255, 255, 255, 0.199);
      }
    }
  }
}
.info {
  margin-left: 5px;
  opacity: 0.2;
  font-size: 12px;
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
