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
        @click.native="$emit('click', user)"
        :user="user"
        :hover="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ExpandedUser,
  fetchRecentUsers,
  searchUsers
} from "@/services/adminService";
import { Vue, Component, Prop } from "vue-property-decorator";
import UserTemplate from "./UserTemplate.vue";

@Component({ components: { UserTemplate } })
export default class Users extends Vue {
  users: ExpandedUser[] | null = null;
  searchInput = "";
  timeout: number | null = null;
  mounted() {
    this.fetchUsers();
  }
  onInput(event: any) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.searchUser(event.target.value), 500);
  }
  async fetchUsers() {
    this.users = [];
    if (this.searchInput) {
      this.users = await searchUsers(this.searchInput);
      return;
    }
    this.users = await fetchRecentUsers();
  }
  async searchUser(value: string) {
    if (!value) return this.fetchUsers();
    this.users = await searchUsers(value);
  }
  updateUser(user: ExpandedUser) {
    if (!this.users) return;
    const index = this.users?.findIndex(u => u.id === user.id);
    if (index < 0) return;
    this.$set(this.users, index, user);
  }
}
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
}
.list {
  overflow: auto;
}
.title {
  margin: 5px;
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
