<template>
  <transition name="show" appear>
    <div class="options" v-click-outside="clickOutside">
      <div class="button">Copy</div>
      <div class="button">Edit</div>
      <div class="button">Delete</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class MessageOptions extends Vue {
  clickOutside() {
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.show-enter-active {
  transition: 0.2s;
}
.show-enter {
  opacity: 0;
  transform: translateY(-10px);
}
.options {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 45px;
  margin-top: 5px;
}

.button {
  margin-left: 5px;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>
