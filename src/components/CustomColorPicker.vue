<template>
  <div class="custom-color-picker">
    <div class="details" @click="showPicker">
      <div class="box" :style="{ background: color }" />
      <div class="name">{{ name }}</div>
    </div>
    <div class="picker-input" ref="pickerInput"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import "@simonwep/pickr/dist/themes/classic.min.css";
import Pickr from "@simonwep/pickr";

@Component({ model: { prop: "color", event: "change" } })
export default class CustomColorPicker extends Vue {
  @Ref() readonly pickerInput!: HTMLElement;
  @Prop() private name!: string;
  @Prop() private color!: string;

  pickr: Pickr | null = null;
  popupShowing = false;
  mounted() {
    this.pickr = Pickr.create({
      el: ".picker-input",
      theme: "classic",
      components: {
        preview: true,
        opacity: true,
        hue: true,
        palette: true,
        interaction: {
          hex: true,
          input: true,
          cancel: true
        }
      }
    });
    this.pickr.on("hide", this.colorChanged);
  }
  beforeDestroy() {
    this.pickr?.off("hide", this.colorChanged);
    this.pickr?.destroyAndRemove();
  }
  showPicker(event: any) {
    this.pickr?.setColor(this.color || "white");
    this.pickr?.show();
    this.popupShowing = true;
  }
  colorChanged(event: any) {
    this.popupShowing = false;
    const hex = event
      .getColor()
      .toHEXA()
      .toString();
    this.$emit("change", hex);
  }
}
</script>

<style lang="scss" scoped>
.custom-color-picker {
  position: relative;
}
.details {
  display: flex;
  align-items: center;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  &:hover {
    color: white;
  }
  .box {
    border-radius: 4px;
    margin-right: 5px;
    height: 15px;
    width: 15px;
    border: solid 2px rgba(255, 255, 255, 0.3);
    background: black;
  }
}
</style>

<style lang="scss">
.pcr-app {
  z-index: 99999999999 !important;
  background: #1a1a1de8;
  border-radius: 4px;
}
.pcr-palette::before {
  background: white !important;
}
.pcr-color-preview::before {
  background: white !important;
}
.custom-color-picker .pickr {
  position: absolute;
  top: 0;
  opacity: 0;
  .pcr-button {
    height: 20px;
  }
}
</style>
