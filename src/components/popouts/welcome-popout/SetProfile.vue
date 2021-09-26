<template>
  <div class="set-profile">
    <Avatar
      :seed-id="currentUser.id || ''"
      :image-id="currentUser.avatar"
      size="120px"
    />
    <CustomButton icon="edit" name="Edit Avatar" />
    <div class="user-tag">
      <CustomInput
        title="Username"
        v-model="username"
        class="username"
        prefixIcon="account_box"
        :connectRight="true"
      />
      <CustomInput
        class="tag"
        title="Tag"
        v-model="tag"
        prefixIcon="local_offer"
        :connectLeft="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CustomButton from "@/components/CustomButton.vue";
import Avatar from "@/components/AvatarImage.vue";
import CustomInput from "@/components/CustomInput.vue";
import { MeModule } from "@/store/modules/me";

export default defineComponent({
  components: { Avatar, CustomButton, CustomInput },
  data() {
    return {
      username: "",
      tag: ""
    };
  },
  mounted() {
    this.username = this.currentUser.username || "";
    this.tag = this.currentUser.tag || "";
  },
  computed: {
    currentUser() {
      return MeModule.user;
    }
  }
});
</script>
<style scoped lang="scss">
.set-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  height: 100%;
  justify-content: center;
}
.user-tag {
  display: flex;
  margin-top: 20px;
  .input {
    flex-shrink: initial;
  }
  .username {
    flex: 1;
  }
  .tag {
    width: 100px;
    flex-shrink: 0;
  }
}
</style>
