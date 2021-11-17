<template>
  <div class="user-template" :class="{ hover }" @click="clicked">
    <div class="checkbox" v-if="showCheckBox" @click="checkboxClicked">
      <CheckBox :class="{ disableCheckmark: disableCheckmark }" :modelValue="isChecked" />
    </div>
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
import CheckBox from "@/components/CheckBox.vue";
import date from "@/utils/date";
import AvatarImage from "@/components/AvatarImage.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserTemplate",
  components: { AvatarImage, CheckBox },
  emits: ["click", "checkBoxClick"],
  props: {
    user: {
      type: Object as PropType<ExpandedUser>,
      required: true,
    },
    showCheckBox: {
      typpe: Boolean,
      default: false,
    },
    checkedUsers: {
      type: Array as PropType<ExpandedUser[]>,
    },
    hover: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    checkboxClicked() {
      if (this.disableCheckmark && !this.isChecked) return;
      this.$emit("checkBoxClick", this.user);
    },
    clicked(event: any) {
      if (event.target.closest(".checkbox")) return;
      this.$emit("click");
    },
  },
  computed: {
    friendlyCreated(): any {
      return date(this.user.created);
    },
    isChecked() {
      return !!this.checkedUsers?.find((u) => u.id === this.user.id);
    },
    disableCheckmark() {
      const anyUser = this.checkedUsers?.[0];
      if (!anyUser) return false;
      return anyUser.banned !== this.user.banned;
    },
  },
});
</script>

<style lang="scss" scoped>
.disableCheckmark {
  opacity: 0.1;
  cursor: not-allowed;
}
.checkbox {
  height: 100%;
  flex-shrink: 0;
}
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
  display: inline;
  word-break: break-all;
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
