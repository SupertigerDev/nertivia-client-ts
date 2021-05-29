<template>
  <div class="panel users" v-if="actions">
    <div class="title">Recent Admin Actions</div>
    <div class="actions">
      <div class="material-icons button" title="Refresh" @click="fetchActions">
        refresh
      </div>
    </div>
    <div class="list">
      <ActionTemplate
        v-for="(action, i) in actions"
        :key="i"
        :action="action"
        :hover="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { fetchRecentActions, Action } from "@/services/adminService";
import { Vue, Component, Prop } from "vue-property-decorator";
import ActionTemplate from "./ActionTemplate.vue";

@Component({ components: { ActionTemplate } })
export default class Users extends Vue {
  actions: Action[] | null = null;
  mounted() {
    this.fetchActions();
  }

  async fetchActions() {
    this.actions = [];
    this.actions = await fetchRecentActions();
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
