<script lang="tsx">
import AvatarImage from "@/components/AvatarImage.vue";
import type { Quote } from "@/interfaces/Message";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import Markup from "@/components/Markup";
import { emitter } from "@/utils/globalBus";
import { h } from "vue";
import Message from "@/interfaces/Message";

import { defineComponent } from "vue";
export default defineComponent({
  components: { AvatarImage, Markup },
  props: {
    quote: {
      type: Object as () => Quote,
      required: true,
    },
    user: Object as () => User,
    nestedLevel: {
      type: Number,
      required: true,
    },
    message: Object as () => Message,
  },
  render() {
    const AvatarBuilder = (creator: any) => {
      return h(AvatarImage, {
        onClick: this.showProfile,
        seedId: creator.id,
        imageId: creator.avatar,
        willHaveClickEvent: true,
        size: "40px",
      });
    };

    const GotoMessageBuilder = (
      <div
        class="material-icons goto-message-icon"
        title="Go To Message"
        onClick={this.gotoMessage}
      >
        keyboard_arrow_up
      </div>
    );

    const MarkupBuilder =
      this.quote.message &&
      h(Markup, {
        text: this.quote.message,
        message: this.message,
        largeEmoji: false,
        nestedLevel: this.nestedLevel,
        messageQuoteFormat: this.nestedLevel >= 2 ? "hidden" : "normal",
      });

    const ContentBuilder = (
      <div class="content">
        <div class="details">
          <div class="username" onClick={this.showProfile}>
            {this.quote.creator.username}
          </div>
        </div>
        <div class="message">{this.failMessage || MarkupBuilder}</div>
      </div>
    );

    return (
      <div class="quote">
        {AvatarBuilder(this.quote.creator)}
        {ContentBuilder}
        {GotoMessageBuilder}
      </div>
    );
  },
  methods: {
    gotoMessage() {
      emitter.emit("scrollToMessage", this.quote.messageID);
    },
    showProfile(event: MouseEvent) {
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
                  this.$route.params.server_id as string,
                  this.user.id
                ) ?? [],
            },
          },
        });
      }
    },
  },
  computed: {
    failMessage() {
      if (!this.quote?.message) {
        return "File Message";
      }
      if (this.quote?.message?.length > 1000) {
        return "This quote is too long to be displayed";
      } else {
        return null;
      }
    },
  },
});
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
