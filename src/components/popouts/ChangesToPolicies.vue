<template>
  <div class="popout-background">
    <div class="generic-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="text">Policy Changes</div>
        </div>
        <div class="inner-content">
          <InformationTemplate
            title="Changes have been made to the Terms and conditions and the Privacy Policy."
          />
          <div class="gap" />
          <AgreementMessage prefix="By clicking on 'I Agree'," />
          <div class="buttons">
            <CustomButton
              name="Request To Delete Account"
              @click="deleteAccount"
              :alert="true"
            />
            <CustomButton name="I Agree" @click="agree" :filled="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import AgreementMessage from "@/components/AgreementMessage.vue";
import { AgreePolicy } from "@/services/authService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { CustomButton, InformationTemplate, AgreementMessage },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    deleteAccount() {
      const w = window.open(
        "mailto:nertivia@gmail.com?subject=Delete%20My%20Account",
        "_blank"
      );
      w?.focus();
    },
    agree() {
      AgreePolicy().then(() => {
        this.$socket.connect();
        this.close();
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.generic-popout {
  background: var(--popout-color);
  border-radius: 4px;
  height: 250px;
  width: 300px;
  overflow: hidden;
  display: flex;
  overflow: hidden;
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
    margin-left: 5px;
  }
  .back-button {
    margin-left: 5px;
    cursor: pointer;
    transition: 0.2s;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  margin: 10px;
}
.description {
  margin-top: 40px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
}
.buttons {
  display: flex;
  justify-content: center;
}
.gap {
  display: flex;
  height: 100%;
}
</style>
