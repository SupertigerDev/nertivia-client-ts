<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="captcha-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="text">Captcha</div>
        </div>
        <div class="inner-content">
          <div class="description">Confirm captcha to continue.</div>
          <Captcha @verify="verify" />
          <div class="buttons">
            <CustomButton :name="$t('back')" @click="close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
import Captcha from "../Captcha.vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { CustomButton, Captcha },
  props: {
    data: {
      type: Object as PropType<{
        callback: any;
      }>,
      required: true,
    },
  },
  data() {
    return {
      requestSent: false,
    };
  },
  computed: {},
  methods: {
    verify(token: string) {
      this.data.callback(token);
      this.close();
    },
    close() {
      PopoutsModule.ClosePopout("captcha-popout");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.captcha-popout {
  background: var(--popout-color);
  border-radius: 4px;
  width: 350px;
  overflow: hidden;
  height: 230px;
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
  height: 21px;
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
}
.description {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 10px;
}
</style>
