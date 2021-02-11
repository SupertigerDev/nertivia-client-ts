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
  background: #090a0a86;
  color: var(--link-color);
  font-weight: bold;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
}

.mention:hover {
  background: #090a0a;
}
</style>
