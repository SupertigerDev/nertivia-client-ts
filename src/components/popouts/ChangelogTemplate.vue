<template>
  <div class="log">
    <div class="header">
      <div class="version">{{ log.version }}</div>
      <div class="date">{{ log.date }}</div>
      <div class="title">{{ log.title }}</div>
    </div>
    <div class="content">
      <!-- New -->
      <div class="title" v-if="newChanges.length">New:</div>
      <ChangelogBulletTemplate
        v-if="newChanges.length"
        :bullets="newChanges"
        icon="add"
        color="var(--success-color)"
      />

      <!-- Changes -->
      <div class="title" v-if="changes.length">Changes:</div>
      <ChangelogBulletTemplate
        v-if="changes.length"
        :bullets="changes"
        icon="change_circle"
        color="var(--primary-color)"
      />

      <!-- Fixes -->
      <div class="title" v-if="fixes.length">Fixes:</div>
      <ChangelogBulletTemplate
        v-if="fixes.length"
        :bullets="fixes"
        icon="bug_report"
        color="var(--alert-color)"
      />

      <div class="body" v-if="log.body" v-html="log.body"></div>
    </div>
  </div>
</template>
<script lang="ts">
import ChangelogBulletTemplate from "./ChangelogBulletTemplate.vue";
import { Changelog } from "@/services/updateService";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({ components: { ChangelogBulletTemplate } })
export default class ChangelogTemplate extends Vue {
  @Prop() private log!: Changelog;

  get changes() {
    return this.log?.changes || [];
  }
  get fixes() {
    return this.log?.fixes || [];
  }
  get newChanges() {
    return this.log?.new || [];
  }
}
</script>
<style lang="scss" scoped>
.log {
  display: flex;
  flex-direction: column;
  margin: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  flex-shrink: 0;
}
.content {
  margin: 10px;
  flex-shrink: 0;
}
.header {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
}
.title {
  font-weight: bold;
}
.date {
  color: rgba(255, 255, 255, 0.8);
}
.version {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
