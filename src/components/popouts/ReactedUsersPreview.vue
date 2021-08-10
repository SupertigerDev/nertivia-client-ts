<template>
  <div class="context" v-if="users" @contextmenu.prevent :style="clampPos">
    <div class="content">
      <div class="items">
        <div class="item" v-for="user in users" :key="user.id">
          <AvatarImage :seedId="user.id" :imageId="user.avatar" size="20px" />
          <div class="username">{{ user.username }}</div>
        </div>
        <div class="item" v-if="appendMe">
          <AvatarImage :seedId="me.id" :imageId="me.avatar" size="20px" />
          <div class="username">{{ me.username }}</div>
        </div>
        <div class="item center" v-if="moreLeft > 0">
          <div class="username">{{ moreLeft }} More</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import windowProperties from "@/utils/windowProperties";
import { PopoutsModule } from "@/store/modules/popouts";
import AvatarImage from "@/components/AvatarImage.vue";

import User from "@/interfaces/User";
import { getReactedUsers } from "@/services/messagesService";
import { MessagesModule } from "@/store/modules/messages";
import { MeModule } from "@/store/modules/me";
import Vue, { PropType } from "vue";

interface IProp {
  messageID: string;
  channelID: string;
  emojiID?: string;
  unicode?: string;
  x: number;
  y: number;
}

export default Vue.extend({
  name: "ReactedUserPreview",
  components: { AvatarImage },
  props: {
    data: {
      type: Object as PropType<IProp>,
      required: false
    },
    identity: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      users: null as User[] | null,
      height: 0,
      width: 0
    };
  },
  computed: {
    moreLeft(): any {
      if (!this.users) return 0;
      if (!this.reaction) return 0;
      return this.reaction.count - this.users.length - (this.appendMe ? 1 : 0);
    },
    appendMe(): any {
      if (!this.users) return false;
      if (!this.reaction) return false;
      return (
        this.reaction.reacted && !this.users.find(u => u.id === this.me.id)
      );
    },
    me(): any {
      return MeModule.user;
    },
    reaction(): any {
      return MessagesModule.messageReaction({
        messageID: this.data.messageID,
        channelID: this.data.channelID,
        emojiID: this.data.emojiID,
        unicode: this.data.unicode
      });
    },
    clampPos(): any {
      const top = this.data.y || 0;
      const left = this.data.x || 0;

      // prevent from going bottom of the screen
      const bottomPos = this.height + top;
      let clampedTop = top;
      if (bottomPos > this.windowDiamentions.height - 45) {
        clampedTop = top - this.height - 35;
      }

      // prevent from going right of the screen
      const widthPos = this.width + left;
      const clampedLeft =
        this.clamp(widthPos, 0, this.windowDiamentions.width) - this.width;

      return {
        top: clampedTop + "px",
        left: clampedLeft + "px"
      };
    },
    windowDiamentions(): any {
      return {
        height: windowProperties.resizeHeight,
        width: windowProperties.resizeWidth
      };
    }
  },
  watch: {
    reaction: {
      // @ts-ignore
      handler: "onReactionChange"
    }
  },
  mounted() {
    this.fetchReactions();
  },
  methods: {
    async fetchReactions() {
      this.users = await getReactedUsers(
        this.data.channelID,
        this.data.messageID,
        3,
        this.data.emojiID,
        this.data.unicode
      );
      this.$nextTick(() => {
        this.height = this.$el.clientHeight;
        this.width = this.$el.clientWidth;
      });
    },
    clamp(num: number, min: number, max: number) {
      return num <= min ? min : num >= max ? max : num;
    },
    onReactionChange() {
      this.fetchReactions();
    }
  }
});
</script>

<style scoped></style>

<style lang="scss" scoped>
.context {
  pointer-events: all;
  background: var(--context-menu-bg-color);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 4px;
  overflow: hidden;
  z-index: 99999999999;
}
.content {
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
  padding: 3px;
}

.item {
  display: flex;
  align-items: center;
  padding: 3px;
  &.center {
    justify-content: center;
    opacity: 0.6;
  }
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
</style>
