<template>
  <div class="dm-drawer">
    <div class="tabs">
      <div
        class="tab"
        @click="changeTab(0)"
        :class="{ selected: selectedTab === 0 }"
      >
        <div class="material-icons">group</div>
        Friends
      </div>
      <div
        class="tab"
        @click="changeTab(1)"
        :class="{ selected: selectedTab === 1 }"
      >
        <div class="material-icons">access_time</div>
        Recents
      </div>
    </div>
    <FriendList v-if="selectedTab === 0" />
    <RecentList v-if="selectedTab === 1" />
    <div class="buttons">
      <div
        class="button"
        @click="openSavedNotes"
        :class="{ selected: savedNotesSelected }"
      >
        <div class="icon material-icons">book</div>
        <div class="title">Saved Notes</div>
      </div>
      <div class="button" @click="addFriendButton">
        <div class="icon material-icons">person_add</div>
        <div class="title">Add Friend</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const FriendList = () =>
  import(
    /* webpackChunkName: "FriendList" */ "@/components/drawers/direct-message-drawer/FriendList.vue"
  );
const RecentList = () =>
  import(
    /* webpackChunkName: "RecentList" */ "@/components/drawers/direct-message-drawer/RecentList.vue"
  );

import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import { PopoutsModule } from "@/store/modules/popouts";
import { Component, Vue } from "vue-property-decorator";

@Component({ components: { FriendList, RecentList } })
export default class MainApp extends Vue {
  selectedTab = parseInt(localStorage.getItem("selectedDmTab") || "0");

  openSavedNotes() {
    if (!MeModule.user.uniqueID) return;
    ChannelsModule.LoadDmChannel(MeModule.user.uniqueID);
  }
  addFriendButton() {
    PopoutsModule.ShowPopout({
      component: "add-friend-popout",
      id: "add-friend"
    });
  }
  changeTab(index: number) {
    this.selectedTab = index;
    localStorage.setItem("selectedDmTab", index.toString());
  }

  get savedNotesSelected() {
    const channelID = this.$route.params.channel_id;
    if (!channelID) return false;
    const DMChannel = ChannelsModule.getDMChannel(channelID);
    const recipient = DMChannel?.recipients?.[0];
    return recipient?.uniqueID === MeModule.user.uniqueID;
  }
}
</script>

<style lang="scss" scoped>
.dm-drawer {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.buttons {
  display: flex;
  height: 45px;
  background: rgba(255, 255, 255, 0.05);
}
.buttons .button {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 3px;
  opacity: 0.7;
  font-size: 14px;
  align-content: center;
  cursor: pointer;
  user-select: none;
  align-items: center;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  &.selected {
    background: var(--primary-color);
    opacity: 1;
  }
}

.tabs {
  display: flex;
  width: 100%;
}
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 30px;
  flex: 1;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.7;
  border-radius: 4px;
  margin: 2px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  &.selected {
    background: var(--primary-color);
    opacity: 1;
  }
  .material-icons {
    margin-right: 5px;
  }
}
@media (max-width: 950px) {
  .dm-drawer {
    padding-bottom: 56px;
  }
}
</style>
