<template>
  <div class="quote" v-bind:class="{ quoteFailed: failMessage }">
    <AvatarImage
      :seedId="this.quote.creator.id"
      :imageId="this.quote.creator.avatar"
      :willHaveClickEvent="true"
      @click.native="showProfile"
      size="40px"
    />
    <div class="content">
      <div class="details">
        <div
          class="username"
          @click="showProfile"
          v-text="this.quote.creator.username"
        />
        <div class="badge bot" v-if="this.quote.creator.bot">BOT</div>
        <!-- <div class="date">DATE</div> -->
      </div>
      <div class="message">{{ failMessage || this.quote }}</div>
    </div>
    <div
      class="material-icons goto-message-icon"
      title="Go To Message"
      @click="goToMessage"
    >
      keyboard_arrow_up
    </div>
  </div>
</template>

<script lang="tsx">
import AvatarImage from "@/components/AvatarImage.vue";
import type { Quote } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import Markup from "@/components/Markup";
import { eventBus } from "@/utils/globalBus";

@Component({components: {AvatarImage, Markup}})
export default class MessageQuote extends Vue {
  @Prop() private quote!: Quote;
  @Prop() private user?: User;

  get failMessage() {
    if (!this.quote?.message) {
      return "File Message";
    }
    if (this.quote?.message?.length > 1000) {
      return "This quote is too long to be displayed";
    } else {
      return null;
    }
  }
  goToMessage() {
    eventBus.$emit('scrollToMessage', this.quote.messageID)
  }

  showProfile(event: PointerEvent) {
    if (this.user != null) {
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
              ) ?? [],
          },
        },
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.quote {
  display: flex;
  background: var(--quote-bg-color);
  border-radius: 4px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 3px;
}
.message {
  color: #e0e0e0;
  line-height: 1.3rem;
}
.content {
  margin: auto;
  margin-left: 3px;
}
.goto-message-icon {
  font-size: 24px;
  user-select: none;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  margin-bottom: auto;
  flex-shrink: 0;
  margin-left: auto;
  &:hover {
    opacity: 1;
  }
}

.details {
  display: flex;
  align-items: center;
  align-content: center;
  .username {
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
  .date {
    opacity: 0.6;
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
