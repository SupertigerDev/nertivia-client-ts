<template>
  <article class="quote" v-bind:class="{ quoteFailed: failMessage }">
    <header class="section">
      <AvatarImage
        :seedId="this.quote.creator.uniqueID"
        :imageId="this.quote.creator.avatar"
        :willHaveClickEvent="true"
        @click.native="showProfile"
        size="20px"
      />
      <!-- todo: maybe make this a MentionMember -->
      <span class="username" @click="showProfile"
        >{{ this.quote.creator.username }}:</span
      >
      <!-- todo: add onClick go to message -->
      <!-- <i title="Go to message" class="go-to-message material-icons"
        >keyboard_arrow_up</i
      > -->
    </header>
    <main class="message" v-if="!this.quote.message">
      <div>File Message</div>
    </main>
    <main class="message" v-else-if="!failMessage">
      <div>{{ this.quote.message }}</div>
    </main>
    <main v-else class="fail-message">
      {{ failMessage }}
    </main>
  </article>
</template>

<script lang="tsx">
import AvatarImage from "@/components/AvatarImage.vue";
import type { Quote } from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { ServerMembersModule } from "@/store/modules/serverMembers";

@Component({components: {AvatarImage}})
export default class MessageQuote extends Vue {
  @Prop() private quote!: Quote;
  @Prop() private user?: User;

  get failMessage() {
    if (this.quote?.message?.length > 1000) {
      return "This quote is too long to be displayed";
    } else {
      return null;
    }
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
                this.user.uniqueID
              ) ?? [],
          },
        },
      });
    }
  }
}
</script>

<style scoped>
/* todo: use all the css variables here */
.quote {
  background: var(--quote-bg-color);
  display: block;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
  margin-top: 5px;
}

.section {
  display: flex;
  padding: 5px;
  font-weight: bold;
  align-items: center;
}

.username {
  font-weight: initial;
  cursor: pointer;
  margin-left: 5px;
}

.username:hover {
  text-decoration: underline;
}

.message {
  padding: 5px;
}

.go-to-message {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  margin-left: auto;
  user-select: none;
  padding-left: 0.75rem;
}

.go-to-message:hover {
  color: white;
}

.material-icons {
  align-self: center;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.quoteFailed {
  background: #a93e3e;
}

.fail-message {
  color: #fff;
  padding: 0.5em;
}
</style>
