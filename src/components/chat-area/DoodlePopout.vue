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
        <div class="color-pick">
          <div class="pick">
            <div class="box" :style="{ backgroundColor: strokeColor }" />
            <div class="name">Stroke</div>
          </div>
          <div class="pick">
            <div class="box" :style="{ backgroundColor }" />
            <div class="name">Background</div>
          </div>
        </div>
      </div>
      <div class="canvas-container">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import { PaintingContext } from "doodlepad";
import CustomButton from "@/components/CustomButton.vue";
@Component({ components: { CustomButton } })
export default class DoodlePopout extends Vue {
  @Ref() readonly canvas!: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;
  paint: PaintingContext | null = null;
  backgroundColor = "white";
  strokeColor = "black";
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

  close() {
    this.$emit("close");
  }
  backgroundClick(event) {
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
}
.strip {
  display: flex;
  gap: 5px;
  margin: 5px;
  .button {
    margin: 0;
  }
}
.color-pick {
  margin: auto;
  margin-right: 0;
  .pick {
    display: flex;
    align-items: center;
    .box {
      border-radius: 4px;
      margin-right: 5px;
      height: 15px;
      width: 15px;
      background: black;
    }
  }
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
