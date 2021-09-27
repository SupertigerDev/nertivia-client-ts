<template>
  <div class="stats">
    <div class="items">
      <div class="box">
        <div class="material-icons icon">person</div>
        <div class="details">
          <div class="title">Users</div>
          <div class="value">{{ userCount }}</div>
        </div>
      </div>
      <div class="box">
        <div class="material-icons icon">dns</div>
        <div class="details">
          <div class="title">Servers</div>
          <div class="value">{{ serverCount }}</div>
        </div>
      </div>
      <div class="box">
        <div class="material-icons icon">chat</div>
        <div class="details">
          <div class="title">Messages</div>
          <div class="value">{{ messageCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchStats } from "@/services/adminService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "StatsPanel",
  data() {
    return {
      userCount: null as string | null,
      serverCount: null as string | null,
      messageCount: null as string | null,
    };
  },
  async mounted() {
    const stats = await fetchStats();
    this.userCount = stats.userCount.toLocaleString();
    this.serverCount = stats.serverCount.toLocaleString();
    this.messageCount = stats.messageCount.toLocaleString();
  },
});
</script>

<style lang="scss" scoped>
.stats {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.items {
  display: flex;
}
.box {
  .title {
    font-size: 18px;
  }
  .value {
    color: rgba(255, 255, 255, 0.6);
  }
  .icon {
    margin-right: 10px;
    flex-shrink: 0;
  }
  position: relative;
  display: flex;
  align-items: center;
  width: 120px;
  padding: 10px;
  margin-left: 10px;
  &::before {
    content: "";
    border-radius: 8px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    z-index: -1;
    opacity: 0.9;
  }
}
.items .box:nth-child(1):before {
  background: var(--primary-color);
}
.items .box:nth-child(2):before {
  background: var(--alert-color);
}
.items .box:nth-child(3):before {
  background: var(--success-color);
}
@media (max-width: 451px) {
  .items {
    flex-direction: column;
  }
  .box {
    width: initial;
    flex: 1;
    margin: 5px 10px 5px 10px;
  }
}
</style>
