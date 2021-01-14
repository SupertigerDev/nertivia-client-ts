<template>
  <div class="invite">
    <AvatarImage
      :animateGif="false"
      :seedId="invite.creator.uniqueID"
      :imageId="invite.creator.avatar"
      :willHaveClickEvent="true"
      size="50px"
      @click.native="showProfile"
    />
    <div class="details">
      <div><span>Link:</span>{{ invite.invite_code }}</div>
      <div><span>Uses:</span>{{ invite.uses }}</div>
      <div>
        <span>Creator:</span>
        <span class="link" @click="showProfile">{{
          invite.creator.username
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Invite from "@/interfaces/Invite";
import { Vue, Component, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { AvatarImage } })
export default class InviteTemplate extends Vue {
  @Prop() private invite!: Invite;
  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.invite.creator.uniqueID }
    });
  }
}
</script>

<style lang="scss" scoped>
.invite {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
}
.details {
  margin-left: 10px;
  span {
    opacity: 0.6;
    margin-right: 5px;
    user-select: none;
  }
  .link {
    margin-right: 0;
    opacity: 1;
    cursor: pointer;
    user-select: initial;
  }
  .link:hover {
    text-decoration: underline;
  }
}
</style>
