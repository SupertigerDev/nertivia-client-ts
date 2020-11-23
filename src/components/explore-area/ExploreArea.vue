<template>
  <div class="explore-area">
    <Header title="Servers" />
    <ExploreServers />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ExploreServers from "./ExploreServers.vue";
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { Header, ExploreServers } })
export default class ExploreArea extends Vue {}
</script>
<style lang="scss" scoped>
.explore-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
