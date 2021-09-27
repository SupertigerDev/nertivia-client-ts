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
import { PropType } from "vue";
import { defineComponent, markRaw } from "vue";
export default defineComponent({
  name: "UserSuggestion",
  components: { SuggestionPopoutTemplate },
  emits: ["selected"],
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  data() {
    return {
      UserSuggestionTemplate: markRaw(UserSuggestionTemplate),
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
    },
  },
});
</script>
<style scoped></style>
