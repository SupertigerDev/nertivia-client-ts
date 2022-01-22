<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="leave-server-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            v-if="server"
            :imageId="server?.avatar"
            :seedId="server?.server_id"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">
            <span style="font-weight: bold">Leave</span>
            {{ server.name }}?
          </div>
        </div>
        <div class="inner-content">
          <div class="description">
            Do you really want to<br />
            <span>
              <span style="font-weight: bold">leave</span>
              {{ server.name }}?
            </span>
            <div class="buttons">
              <CustomButton :name="$t('back')" @click="close" icon="clear" />
              <!-- TODO: i18n -->
              <CustomButton
                icon="exit_to_app"
                @click="buttonClicked"
                :name="requestSent ? 'Leaving...' : 'Leave'"
                :alert="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { leaveServer } from "@/services/serverService";
import CustomButton from "@/components/CustomButton.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { ServersModule } from "@/store/modules/servers";
export default defineComponent({
  name: "ProfilePopout",
  components: { AvatarImage, CustomButton },
  props: {
    identity: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<{
        id: string;
        serverId: string;
      }>,
      required: true,
    },
  },
  data() {
    return {
      requestSent: false,
      server: ServersModule.servers[this.data.serverId],
    };
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
    buttonClicked() {
      if (this.requestSent) return;
      this.requestSent = true;
      leaveServer(this.data.serverId)
        .then(() => {
          this.close();
        })
        .catch(() => {
          this.requestSent = false;
        });
    },
  },
});
</script>
<style lang="scss" scoped>
.leave-server-popout {
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
  margin-top: 40px;
  text-align: center;
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
