<template>
  <div class="user">
    <AvatarImage
      :animateGif="false"
      :seedId="user.id"
      :imageId="user.avatar"
      :willHaveClickEvent="true"
      size="30px"
      @click.native="showProfile"
    />
    <div class="details">
      <span>{{ user.username }}</span>
      <span>:</span>
      <span class="tag">{{ user.tag }}</span>
    </div>
    <CustomButton
      class="button"
      :disabled="requestSent"
      @click="unban"
      :name="requestSent ? 'Unbanning...' : 'Unban'"
      :warn="true"
      :filled="true"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import User from "@/interfaces/User";
import { unbanMember } from "@/services/serverService";

@Component({ components: { AvatarImage, CustomButton } })
export default class UserTemplate extends Vue {
  requestSent = false;
  @Prop() private user!: User;
  unban() {
    if (this.requestSent) return;
    this.requestSent = true;
    unbanMember(this.serverID, this.user.id).then(() => {
      this.$emit("deleted");
    });
  }
  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { id: this.user.id }
    });
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  border-radius: 4px;
  transition: 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.details {
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag {
  color: rgba(255, 255, 255, 0.6);
}
.button {
  margin-left: auto;
}
</style>
