<template>
  <div class="log">
    <div class="header">
      <div class="version">{{ log.version }}</div>
      <div class="date">{{ log.date }}</div>
      <div class="header-title">{{ log.title }}</div>
    </div>
    <div class="content">
      <img class="preview-image" v-if="log.image_url" :src="log.image_url" />
      <!-- New -->
      <div class="title new" v-if="newChanges.length">
        <span class="material-icons">add</span> New
      </div>
      <ChangelogBulletTemplate
        v-if="newChanges.length"
        :bullets="newChanges"
        color="var(--success-color)"
      />

      <!-- Changes -->
      <div class="title changes" v-if="changes.length">
        <span class="material-icons">change_circle</span> Changes
      </div>
      <ChangelogBulletTemplate
        v-if="changes.length"
        :bullets="changes"
        color="var(--primary-color)"
      />

      <!-- Fixes -->
      <div class="title fixes" v-if="fixes.length">
        <span class="material-icons">bug_report</span> Fixes
      </div>
      <ChangelogBulletTemplate
        v-if="fixes.length"
        :bullets="fixes"
        color="var(--alert-color)"
      />
      <!-- Note -->
      <div class="title note" v-if="log.body">
        <span class="material-icons">info</span> Note
      </div>
      <div class="body" v-if="log.body" v-html="log.body"></div>
    </div>
  </div>
</template>
<script lang="ts">
import ChangelogBulletTemplate from "./ChangelogBulletTemplate.vue";
import { Changelog } from "@/services/updateService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChangelogTemplate",
  components: { ChangelogBulletTemplate },
  props: {
    log: {
      type: Object as PropType<Changelog>,
      required: true,
    },
  },
  computed: {
    changes(): any {
      return this.log?.changes || [];
    },
    fixes(): any {
      return this.log?.fixes || [];
    },
    newChanges(): any {
      return this.log?.new || [];
    },
  },
});
</script>
<style lang="scss" scoped>
.log {
  display: flex;
  flex-direction: column;
  margin: 5px;
  // background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  flex-shrink: 0;
  &:after {
    content: "";
    height: 4px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    width: 90%;
    align-self: center;
  }
}
.content {
  display: flex;
  flex-direction: column;
  margin: 10px;
  flex-shrink: 0;
}
.header {
  // background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  padding-bottom: 0;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  .date {
    color: rgba(255, 255, 255, 0.6);
  }
  .header-title {
    font-weight: bold;
  }
}
.title {
  display: flex;
  align-items: center;
  padding: 3px;
  font-weight: bold;
  font-size: 12px;
  border-radius: 4px;
  align-self: flex-start;
  padding-right: 5px;
  .material-icons {
    margin-right: 3px;
    font-size: 18px;
    transform: rotate(0.03deg);
  }
  &.new {
    background: var(--success-color);
  }

  &.changes {
    background: var(--primary-color);
  }

  &.fixes {
    background: var(--alert-color);
  }

  &.note {
    background: var(--warn-color);
  }
}
.body {
  color: rgba(255, 255, 255, 0.7);
  margin-left: 20px;
  margin-top: 5px;
}
.version {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: rgba(255, 255, 255, 0.6);
}
.preview-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 5px;
}
</style>
