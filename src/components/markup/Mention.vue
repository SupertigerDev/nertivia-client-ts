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
  background: rgba(0, 0, 0, 0.3);
  color: rgb(94, 164, 255);
  font-weight: bold;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
}

.mention:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>
