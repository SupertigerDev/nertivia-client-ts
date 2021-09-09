<template>
  <div class="not-found">
    <Header />
    <div class="content">
      <div class="center-box">
        <div class="title">404</div>
        <div class="description">Nothing is here.</div>
        <router-link to="/" class="link">
          <CustomButton icon="home" name="Home" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Header from "@/components/home-page/Header.vue";
import CustomButton from "@/components/CustomButton.vue";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Home",
  components: { Header, CustomButton }
});
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  color: white;
  overflow: auto;
  height: 100%;
}
.content {
  display: flex;
  height: 100%;
}
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  text-align: center;
  margin: auto;
}
.link {
  text-decoration: none;
}
.title {
  font-size: 70px;
  font-weight: bold;
}
.description {
  opacity: 0.6;
  margin-bottom: 10px;
}
</style>
