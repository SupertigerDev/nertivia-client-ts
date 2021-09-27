<template>
  <div class="outer-floating-card" v-click-outside="clickOutsideUserArea">
    <ProfileCard :hideTitle="true" :identity="identity" />
  </div>
</template>
<script lang="ts">
import ProfileCard from "@/components/dashboard-area/ProfileCard.vue";
import { PopoutsModule } from "@/store/modules/popouts";

import { defineComponent } from "vue";
export default defineComponent({
  name: "FloatingProfileCard",
  components: { ProfileCard },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  methods: {
    clickOutsideUserArea(event: any) {
      if (event.target.closest(".item.me")) return;
      if (event.target.closest(".context")) return;
      PopoutsModule.ClosePopout(this.identity);
    },
  },
});
</script>

<style lang="scss" scoped>
.outer-floating-card {
  position: absolute;
  bottom: 0;
  left: 55px;
  pointer-events: all;
}
@media (max-width: 950px) {
  .outer-floating-card {
    bottom: 55px;
    right: 0px;
    left: initial;
  }
}
</style>
