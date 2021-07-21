<template>
  <div v-click-outside="backgroundClick" class="doodle-popout">
    <div class="inner">
      <div class="strip">
        <CustomButton
          class="button"
          iconSize="18px"
          icon="undo"
          :alert="true"
          @click="paint && paint.undoStroke()"
        />
        <CustomButton
          class="button"
          iconSize="18px"
          icon="redo"
          @click="paint && paint.redoStroke()"
        />
        <CustomButton
          class="button"
          :class="{ erase }"
          name="Erase"
          :alert="true"
          @click="onEraseClick"
        />
        <div class="color-pick">
          <CustomColorPicker
            name="Stroke"
            v-model="strokeColor"
            @change="onStrokeColorChange"
          />
          <CustomColorPicker
            name="Background"
            :allowOpacity="false"
            @change="onBackgroundColorChange"
            v-model="backgroundColor"
          />
        </div>
      </div>
      <div class="canvas-container">
        <canvas ref="canvas" class="canvas"></canvas>
      </div>
      <div class="bottom-items">
        <div class="title">
          Stroke <span>{{ strokeSize }}px</span>
        </div>
        <input
          type="range"
          @change="onStrokeSizeChange"
          min="1"
          max="200"
          v-model="strokeSize"
          step="1"
        />
        <div class="title">
          Stabilization
          <span>{{ Math.round(parseFloat(stablization) * 100) }}%</span>
        </div>
        <input
          type="range"
          @change="onStablizationChange"
          min="0"
          max="1"
          v-model="stablization"
          step="0.01"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { PaintingContext } from "doodlepad";
import CustomButton from "@/components/CustomButton.vue";
import CustomColorPicker from "@/components/CustomColorPicker.vue";
@Component({ components: { CustomButton, CustomColorPicker } })
export default class DoodlePopout extends Vue {
  @Ref() readonly canvas!: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;
  paint: PaintingContext | null = null;
  backgroundColor = "white";
  strokeColor = "black";
  strokeSize = "3";
  stablization = "0.50";
  erase = false;

  mounted() {
    const parentElement = this.canvas.parentElement;
    if (!parentElement) return;
    this.canvas.height = parentElement.clientHeight;
    this.canvas.width = parentElement.clientWidth;

    this.context = this.canvas.getContext("2d");
    if (!this.context) return;
    this.paint = new PaintingContext(this.context);
    this.paint.backgroundColor = this.backgroundColor;
    this.paint.strokeColor = this.strokeColor;
    this.paint.strokeSize = parseInt(this.strokeSize);
    this.paint.strokeSmoothing = parseFloat(this.stablization);

    document.addEventListener("keydown", this.onKeyDown);
  }
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.ctrlKey && !event.shiftKey && event.key.toUpperCase() === "Z") {
      this.paint?.undoStroke();
    }
    if (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === "Z") {
      this.paint?.redoStroke();
    }
  }
  onBackgroundColorChange(color: string) {
    if (!this.paint) return;
    this.paint.backgroundColor = color;
  }
  onStrokeColorChange(color: string) {
    if (!this.paint) return;
    this.paint.strokeColor = color;
  }
  onStrokeSizeChange(event: any) {
    if (!this.paint) return;
    this.paint.strokeSize = parseInt(event.target.value);
  }
  onStablizationChange(event: any) {
    if (!this.paint) return;
    this.paint.strokeSmoothing = parseFloat(event.target.value);
  }
  onEraseClick() {
    if (!this.paint) return;
    if (!this.erase) {
      this.erase = true;
      this.paint.strokeColor = "currentBackground";
      return;
    }
    this.erase = false;
    this.paint.strokeColor = this.strokeColor;
  }
  close() {
    this.$emit("close");
  }
  backgroundClick(event) {
    if (event.target.closest(".pcr-app")) return;
    if (!event.target.closest(".doodle-button")) this.close();
  }
}
</script>

<style scoped lang="scss">
.doodle-popout {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 111111111111111;
}

.doodle-popout .inner {
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  z-index: 99999;
  height: 352px;
  width: 375px;
  overflow: hidden;
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
.canvas-container {
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.canvas {
  touch-action: none;
}
.strip {
  display: flex;
  gap: 5px;
  margin: 5px;
  .button {
    margin: 0;
    width: 50px;
    &.erase {
      background-color: var(--alert-color);
      color: white;
    }
  }
}
.bottom-items {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-bottom: 5px;
  .title {
    margin-left: 5px;
    display: flex;
    span {
      margin-left: auto;
      margin-right: 10px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
.color-pick {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: auto;
  margin-right: 0;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
