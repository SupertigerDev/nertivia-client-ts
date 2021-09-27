<template>
  <div class="popout-background">
    <div class="generic-popout">
      <div class="content animate-in">
        <div class="header">
          <div
            class="material-icons back-button"
            @click="close"
            :title="$t('back')"
          >
            close
          </div>
          <div class="text">Link With Google Drive</div>
        </div>
        <div class="inner-content">
          <InformationTemplate
            title="Link your Google drive with Nertivia to upload large files and images."
          />
          <div class="graphics">
            <img src="@/assets/google-drive-logo.webp" />
            <div class="material-icons icon">navigate_next</div>
            <img src="@/assets/logo.svg" />
          </div>
          <div class="buttons">
            <CustomButton name="Cancel" @click="close" :alert="true" />
            <CustomButton name="Link Now" @click="link" :filled="true" />
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
import { googleDriveLinkURL } from "@/services/authService";
import { MeModule } from "@/store/modules/me";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { CustomButton, InformationTemplate },
  props: {
    identity: {
      type: String,
      required: true,
    },
  },
  computed: {
    linked(): any {
      return MeModule.user.googleDriveLinked;
    },
  },
  watch: {
    linked: {
      handler: "onLinkedChange",
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    link() {
      googleDriveLinkURL().then(({ url }) => {
        window.open(url, "_blank");
      });
    },
    buttonClicked() {
      this.close();
    },
    onLinkedChange(linked: boolean) {
      if (linked) {
        this.close();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.generic-popout {
  background: var(--popout-color);
  border-radius: 4px;
  height: 300px;
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
.graphics {
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 30px;
  justify-content: center;
  .icon {
    font-size: 40px;
  }
  img {
    height: 60px;
    width: 60px;
  }
}
</style>
