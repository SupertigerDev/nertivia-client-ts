<template>
  <div class="action-template">
    <div class="content">
      <div class="main-details" v-html="actionDetails" />
      <div class="date">{{ friendlyDate }}</div>
      <CustomButton class="button" name="Undo action" />
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
    if (this.action.action === "SUSPEND_USER") {
      return `<strong>${
        this.action.admin.username
      }</strong> suspended <strong>${
        this.action.user?.username
      }</strong> for <strong>${this.action.reason ||
        "Not specified."}</strong>`;
    }
    if (this.action.action === "UNSUSPEND_USER") {
      return `<strong>${this.action.admin.username}</strong> unsuspended <strong>${this.action.user?.username}</strong>`;
    }
    if (this.action.action === "BAN_IP") {
      return `<strong>${this.action.admin.username}</strong> IP banned <strong>${this.action.ip_ban}</strong> for 5 days.`;
    }
    if (this.action.action === "UNBAN_IP") {
      return `<strong>${this.action.admin.username}</strong> removed IP Ban <strong>${this.action.ip_ban}</strong>`;
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
    font-size: 14px;
  }
}
.button {
  margin-left: 0;
}
.main-details {
  display: inline;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>

<style>
.action-template strong {
  color: white;
}
</style>
