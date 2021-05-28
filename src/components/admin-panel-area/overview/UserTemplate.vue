<template>
  <div class="user-template" :class="{ hover }">
    <AvatarImage :seedId="user.id" :imageId="user.avatar" size="40px" />
    <div class="content">
      <div class="main-details">
        <span class="username">{{ user.username }}</span>
        <span class="tag">:{{ user.tag }}</span>
      </div>
      <div class="date">{{ friendlyCreated }}</div>
      <div class="tags">
        <div class="tag bot" v-if="user.bot">BOT</div>
        <div class="tag suspended" v-if="user.banned">SUSPENDED</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExpandedUser } from "@/services/adminService";
import date from "@/utils/date";
import { Vue, Component, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";

@Component({ components: { AvatarImage } })
export default class UserTemplate extends Vue {
  @Prop() private user!: ExpandedUser;
  @Prop() private hover!: boolean;
  get friendlyCreated() {
    return date(this.user.created);
  }
}
</script>

<style lang="scss" scoped>
.user-template {
  display: flex;
  align-items: center;
  padding: 5px;
  &.hover:hover {
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
.main-details {
  display: flex;
  display: inline;
  .tag {
    color: rgba(255, 255, 255, 0.7);
  }
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
