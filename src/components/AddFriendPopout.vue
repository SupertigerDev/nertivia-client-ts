<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="delete-message-popout">
      <div class="content animate-in">
        <div class="header">
        <div class="icon material-icons">person_add</div>
          <div class="text">Add Friend</div>
        </div>
        <div class="inner-content">
          <div class="info">Add a friend by typing their username and tag (username:tag)</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { PopoutsModule } from "@/store/modules/popouts";

@Component
export default class ProfilePopout extends Vue {

  close() {
    PopoutsModule.ClosePopout("add-friend");
  }
  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      this.close();
    }
  }


}
</script>
<style lang="scss" scoped>
.delete-message-popout {
  background: var(--popout-color);
  border-radius: 8px;
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
  margin-top: 10px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 10px;
}
.button {
  background: var(--primary-color);
  margin: 10px;
  border-radius: 8px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
  &.warn {
    background: var(--alert-color);
  }
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
