<template>
  <div class="panel users" v-if="users">
    <div class="title">Users</div>
    <div class="actions">
      <input
        class="search"
        type="text"
        placeholder="Search User"
        v-model="searchInput"
        @input="onInput"
      />
      <div class="material-icons button" title="Refresh" @click="fetchUsers">
        refresh
      </div>
    </div>
    <div class="list">
      <UserTemplate
        v-for="user in users"
        :key="user.id"
        @click="$emit('click', user)"
        @checkBoxClick="checkBoxClick"
        :show-check-box="true"
        :checkedUsers="checkedUsers"
        :user="user"
        :hover="true"
      />
    </div>
    <div class="checked-actions" v-if="checkedUsers.length">
      <CustomButton
        name="Unsuspend selected"
        v-if="suspendChecked"
        @click="unsuspendBatch"
      />
      <CustomButton
        v-else
        name="Suspend selected"
        :alert="true"
        @click="suspendBatch"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ExpandedUser,
  fetchRecentUsers,
  searchUsers,
} from "@/services/adminService";
import UserTemplate from "./UserTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";
import { defineComponent } from "vue";
import { PopoutsModule } from "@/store/modules/popouts";
export default defineComponent({
  name: "Users",
  emits: ["click", "suspendBatch", "unsuspendBatch"],
  components: { UserTemplate, CustomButton },
  data() {
    return {
      users: null as ExpandedUser[] | null,
      searchInput: "",
      timeout: null as number | null,
      checkedUsers: [] as ExpandedUser[],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    suspendBatch() {
      PopoutsModule.ShowPopout({
        id: "admin-suspend-user-popout",
        component: "AdminSuspendUser",
        data: { users: this.checkedUsers, callback: this.suspendCallback },
      });
    },
    unsuspendBatch() {
      PopoutsModule.ShowPopout({
        id: "admin-unsuspend-user-popout",
        component: "AdminUnsuspendUser",
        data: { users: this.checkedUsers, callback: this.unsuspendCallback },
      });
    },
    suspendCallback(user: ExpandedUser) {
      this.$emit("suspendBatch", user);
      this.checkedUsers = this.checkedUsers.filter((u) => u.id !== user.id);
    },
    unsuspendCallback(data: any) {
      this.$emit("unsuspendBatch", data);
      this.checkedUsers = this.checkedUsers.filter(
        (u) => u.id !== data.user.id
      );
    },
    checkBoxClick(user: ExpandedUser) {
      const existingIndex = this.checkedUsers.findIndex(
        (u) => u.id === user.id
      );
      if (existingIndex >= 0) {
        this.checkedUsers.splice(existingIndex, 1);
        return;
      }
      this.checkedUsers.push(user);
    },
    onInput(event: any) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(
        () => this.searchUser(event.target.value),
        500
      );
    },
    async fetchUsers() {
      this.users = [];
      if (this.searchInput) {
        this.users = await searchUsers(this.searchInput);
        return;
      }
      this.users = await fetchRecentUsers();
    },
    async searchUser(value: string) {
      if (!value) return this.fetchUsers();
      this.users = await searchUsers(value);
    },
    updateUser(user: ExpandedUser) {
      if (!this.users) return;
      const index = this.users?.findIndex((u) => u.id === user.id);
      if (index < 0) return;
      this.users[index] = user;
    },
  },
  computed: {
    suspendChecked() {
      return this.checkedUsers[0].banned;
    },
  },
});
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 10px;
  width: 250px;
  flex-shrink: 0;
}
.list {
  overflow: auto;
}
.title {
  margin: 5px;
}

.checked-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}
.actions {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  .search {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    border: none;
    padding: 10px;
    outline: none;
    color: white;
    flex: 1;
  }
  .button {
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    margin-left: 5px;
    border-radius: 4px;
    &:hover {
      background: var(--primary-color);
    }
  }
}
</style>
