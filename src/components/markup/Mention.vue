<template functional>
  <span class="mention">{{ props.text }}</span>
</template>

<script>
export default {
  props: ["text"]
};
</script>

<style>
.mention {
  display: inline-block;
  color: var(--link-color);
  font-weight: bold;
  cursor: pointer;
}
.mention:hover {
  text-decoration: underline;
}
</style>
