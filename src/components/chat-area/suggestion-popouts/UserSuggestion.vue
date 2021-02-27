<template>
  <SuggestionPopoutTemplate
    :items="users"
    ref="template"
    :template="UserSuggestionTemplate"
    @selected="onSelected"
  />
</template>

<script lang="ts">
import SuggestionPopoutTemplate from "./SuggestionPopoutTemplate.vue";
import UserSuggestionTemplate from "./UserSuggestionTemplate.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import User from "@/interfaces/User";

@Component({ components: { SuggestionPopoutTemplate } })
export default class ChannelSuggestion extends Vue {
  @Prop() private users!: User[];
  UserSuggestionTemplate = UserSuggestionTemplate;

  up() {
    (this.$refs.template as any).up();
  }
  down() {
    (this.$refs.template as any).down();
  }
  enter() {
    (this.$refs.template as any).enter();
  }
  onSelected(user: User) {
    this.$emit("selected", `@${user.username}:${user.tag} `);
  }
}
</script>
<style scoped></style>
