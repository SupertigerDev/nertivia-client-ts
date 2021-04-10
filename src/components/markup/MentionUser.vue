<template>
  <span @click="showProfile" @contextmenu.prevent="userContext"
    ><Mention :text="display"
  /></span>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/interfaces/User";
import Mention from "./Mention.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServerMembersModule } from "@/store/modules/serverMembers";

export interface MentionMemberProps {
  user: User;
}

export default Vue.extend<unknown, unknown, unknown, MentionMemberProps>({
  components: { Mention },
  props: {
    user: Object
  },
  computed: {
    display() {
      return `@${this.user.username}`;
    }
  },
  methods: {
    userContext(event: MouseEvent) {
      PopoutsModule.ShowPopout({
        id: "context",
        component: "UserContextMenu",
        key: this.user.id + event.clientX + event.clientY,
        data: {
          tempUser: this.user,
          x: event.clientX,
          y: event.clientY,
          id: this.user.id
        }
      });
    },
    showProfile(event: PointerEvent) {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "MiniProfilePopout",
        data: {
          x: event.x,
          y: event.y,
          member: {
            member: this.user,
            roles:
              ServerMembersModule.memberRoles(
                this.$route.params.server_id,
                this.user.id
              ) ?? []
          }
        }
      });
    }
  }
});
</script>
