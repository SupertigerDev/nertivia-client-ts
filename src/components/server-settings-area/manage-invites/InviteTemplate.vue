<template>
  <div class="invite">
    <AvatarImage
      :animateGif="false"
      :seedId="invite.creator.id"
      :imageId="invite.creator.avatar"
      :willHaveClickEvent="true"
      size="50px"
      @click="showProfile"
    />
    <div class="details">
      <div>
        <span>{{ $t("server-settings.manage-invites.link") }}:</span
        ><a
          :href="`${prefixURL}i/${invite.invite_code}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ prefixURL }}i/{{ invite.invite_code }}</a
        >
      </div>
      <div>
        <span>{{ $t("server-settings.manage-invites.uses") }}:</span
        >{{ invite.uses }}
      </div>
      <div>
        <span>{{ $t("server-settings.manage-invites.creator") }}:</span>
        <span class="link" @click="showProfile">{{
          invite.creator.username
        }}</span>
      </div>
      <div class="buttons">
        <div class="button" @click="copyLink">
          <span class="material-icons">content_copy</span>
          <span>{{ $t("generic.copy") }}</span>
        </div>
        <div class="button alert" @click="$emit('deleteClicked')">
          <span class="material-icons">delete</span>
          <span>{{ $t("generic.delete") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Invite from "@/interfaces/Invite";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
export default defineComponent({
  name: "InviteTemplate",
  components: { AvatarImage },
  props: {
    invite: {
      type: Object as PropType<Invite>,
      required: true,
    },
  },
  data() {
    return {
      prefixURL: process.env.VUE_APP_MAIN_APP_URL,
    };
  },
  methods: {
    showProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.invite.creator.id },
      });
    },
    copyLink() {
      toClipboard(`${this.prefixURL}i/${this.invite.invite_code}`);
      alert(this.$t("generic.copied"));
    },
  },
});
</script>

<style lang="scss" scoped>
.invite {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
}
.details {
  display: flex;
  flex-direction: column;
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
.buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px;
  margin-top: 5px;
  border-radius: 4px;
  align-self: flex-start;
  .button {
    display: flex;
    align-items: center;
    align-content: center;
    opacity: 0.6;
    cursor: pointer;
    transition: 0.2s;
    span {
      opacity: 1;
    }
    &:hover {
      opacity: 1;
    }
    &.alert {
      color: var(--alert-color);
    }
  }
}
</style>
