<template>
  <span
    class="outer-mention"
    @click="showProfile"
    @contextmenu.prevent="userContext"
  >
    <AvatarImage :imageId="user.avatar" :seedId="user.id" size="20px" />
    <Mention :text="display" />
  </span>
</template>

<script lang="ts">
import { PropType } from "vue";
import User from "@/interfaces/User";
import Mention from "./Mention.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServerMembersModule } from "@/store/modules/serverMembers";

import { defineComponent } from "vue";
export default defineComponent({
  components: { Mention, AvatarImage },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  computed: {
    display() {
      return `${this.user.username}`;
    },
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
          id: this.user.id,
        },
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
                this.$route.params.server_id as string,
                this.user.id
              ) ?? [],
          },
        },
      });
    },
  },
});
</script>

<style>
.outer-mention {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  vertical-align: -5px;
}
.outer-mention .avatar {
  margin-right: 2px;
}
.outer-mention .avatar .image {
  border: 0;
}
.outer-mention .mention {
  line-height: 1.1;
}
.outer-mention:hover > .mention {
  text-decoration: underline;
}
</style>
