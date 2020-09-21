<template>
  <div class="interface">
    <div class="description">Change the appearance of Nertivia.</div>
    <div class="box">
      <div class="title">Colors</div>
      <div class="color-input" @click="$refs.colorPicker.click()">
        <div class="name">Primary Color</div>
        <div class="color-box" />
        <input
          class="hidden"
          ref="colorPicker"
          @change="colorChanged"
          type="color"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MainApp extends Vue {
  colorChanged(event: any) {
    localStorage.setItem("primaryColor", event.target.value);
    document.documentElement.style.setProperty(
      "--primary-color",
      event.target.value
    );
  }
}
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
}
.description {
  opacity: 0.7;
  margin: 5px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  align-self: flex-start;
  margin-left: 5px;
}
.color-input {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  align-content: center;
}
.title {
  font-weight: bold;
}
.color-box {
  height: 20px;
  width: 20px;
  background: var(--primary-color);
  margin-left: 6px;
}
.hidden {
  display: none;
}
</style>
