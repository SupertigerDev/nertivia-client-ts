<template>
  <div class="action-template">
    <div class="content">
      <div class="main-details" v-html="actionDetails" />
      <CustomButton class="button" name="Undo action" />

      <div class="date">{{ friendlyDate }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExpandedUser } from "@/services/adminService";
import date from "@/utils/date";
import { Vue, Component, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { Action } from "@/services/adminService";
import CustomButton from "@/components/CustomButton.vue";

@Component({ components: { AvatarImage, CustomButton } })
export default class ActionTemplate extends Vue {
  @Prop() private action!: Action;
  get friendlyDate() {
    return date(this.action.date);
  }
  get actionDetails() {
    if (this.action.action === "SUSPEND") {
      return `<strong>${this.action.admin.username}</strong> suspended <strong>${this.action.user?.username}</strong>.`;
    }
    if (this.action.action === "IP_BAN") {
      return `<strong>${this.action.admin.username}</strong> IP banned <strong>${this.action.ip_ban}</strong> for 5 days.`;
    }
    return `Unknown action: ${this.action.action}`;
  }
}
</script>

<style lang="scss" scoped>
.action-template {
  display: flex;
  align-items: center;
  padding: 5px;
  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
  }
}
.content {
  margin-left: 5px;
  .date {
    color: rgba(255, 255, 255, 0.4);
  }
}
.button {
  margin-left: 0;
}
.main-details {
  display: flex;
  display: inline;
  color: rgba(255, 255, 255, 0.7);
}
.tags {
  display: flex;
  .tag {
    margin-top: 5px;
    background: rgba(0, 0, 0, 0.24);
    border-radius: 4px;
    padding: 3px;
    font-size: 12px;
    &.bot {
      background: var(--primary-color);
    }
    &.suspended {
      background: var(--alert-color);
      margin-left: 5px;
    }
  }
}
</style>

<style>
.action-template strong {
  color: white;
}
</style>
