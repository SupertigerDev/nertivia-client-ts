<template>
  <div class="panel users" v-if="actions">
    <div class="title">
      <div class="text">
        Recent Admin Actions
        <div class="notice">Log Expires after 5 days</div>
      </div>
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
import ActionTemplate from "./ActionTemplate.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "Users",
  components: { ActionTemplate },
  data() {
    return {
      actions: null as Action[] | null
    };
  },
  mounted() {
    this.fetchActions();
  },
  methods: {
    async fetchActions() {
      this.actions = [];
      this.actions = await fetchRecentActions();
    }
  }
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
  display: flex;
  align-items: center;
  margin: 5px;
}

.button {
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  margin-left: auto;
  border-radius: 4px;
  &:hover {
    background: var(--primary-color);
  }
}
.notice {
  opacity: 0.7;
  font-size: 14px;
}
</style>
