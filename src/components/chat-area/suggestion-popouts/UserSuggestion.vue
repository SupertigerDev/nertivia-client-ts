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
import User from "@/interfaces/User";
import Vue, { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserSuggestion",
  components: { SuggestionPopoutTemplate },
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: false
    }
  },
  data() {
    return {
      UserSuggestionTemplate: UserSuggestionTemplate
    };
  },
  methods: {
    up() {
      (this.$refs.template as any).up();
    },
    down() {
      (this.$refs.template as any).down();
    },
    enter() {
      (this.$refs.template as any).enter();
    },
    onSelected(user: User) {
      this.$emit("selected", `@${user.username}:${user.tag} `);
    }
  }
});
</script>
<style scoped></style>
