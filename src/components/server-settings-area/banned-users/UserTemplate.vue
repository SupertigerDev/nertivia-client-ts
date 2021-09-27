<template>
  <div class="user">
    <AvatarImage
      :animateGif="false"
      :seedId="user.id"
      :imageId="user.avatar"
      :willHaveClickEvent="true"
      size="30px"
      @click="showProfile"
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
      :name="
        requestSent
          ? $t('server-settings.banned-users.unbanning')
          : $t('server-settings.banned-users.unban')
      "
      :alert="true"
      :filled="true"
    />
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import User from "@/interfaces/User";
import { unbanMember } from "@/services/serverService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserTemplate",
  components: { AvatarImage, CustomButton },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data() {
    return {
      requestSent: false,
    };
  },
  computed: {
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  methods: {
    unban() {
      if (this.requestSent) return;
      this.requestSent = true;
      unbanMember(this.serverID, this.user.id).then(() => {
        this.$emit("deleted");
      });
    },
    showProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.user.id },
      });
    },
  },
});
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
