<template>
  <div class="badges">
    <div class="title">{{ $t("profile-popout.badges") }}</div>
    <div class="list">
      <div
        class="badge"
        v-for="item in badges"
        :key="item.name"
        :style="{ borderColor: item.color }"
        :title="item.name"
      >
        <img :src="item.iconURL" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";

import { Badge } from "@/constants/badges";

@Component({
  components: { AvatarImage }
})
export default class Badges extends Vue {
  @Prop() private badges!: Badge[];
}
</script>
<style scoped lang="scss">
.badges {
  flex-shrink: 0;
  margin: 3px;
  transition: 0.2s;
  cursor: default;
  user-select: none;
}
.list {
  display: flex;
  overflow: auto;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
}
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: solid 2px transparent;
  padding: 5px;
  height: 23px;
  width: 23px;
  img {
    height: 15px;
    width: 15px;
  }
}
</style>
