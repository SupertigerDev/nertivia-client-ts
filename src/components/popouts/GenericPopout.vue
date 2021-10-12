<template>
  <div class="popout-background">
    <div class="generic-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="text">{{ data.title }}</div>
        </div>
        <div class="inner-content">
          <div class="description">
            {{ data.description }}
          </div>
          <div class="buttons">
            <CustomButton
              icon="clear"
              v-if="data.callback"
              name="Cancel"
              :alert="true"
              @click="close"
            />
            <CustomButton
              icon="done"
              name="Understood"
              @click="buttonClicked"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { CustomButton },
  props: {
    identity: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<{
        title: string;
        description: string;
        callback?: any;
      }>,
      required: true,
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    buttonClicked() {
      this.data.callback?.();
      this.close();
    },
  },
});
</script>
<style lang="scss" scoped>
.generic-popout {
  background: var(--popout-color);
  border-radius: 4px;
  width: 300px;
  overflow: hidden;
  height: 200px;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
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

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  height: 30px;
  flex-shrink: 0;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 10px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  height: 100%;
}
.description {
  margin-top: 40px;
  text-align: center;
}
.buttons {
  display: flex;
  margin: auto;
}
</style>
