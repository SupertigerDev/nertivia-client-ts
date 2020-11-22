<template>
  <div>
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
