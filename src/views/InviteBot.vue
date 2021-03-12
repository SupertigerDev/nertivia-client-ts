<template>
  <div class="invite-bot-page">
    <Header />
    <LoadingScreen v-if="!bot" />
    <div class="content" v-if="bot">
      <div class="center" v-if="bot">
        <AvatarImage
          :imageId="bot.avatar"
          :seedId="bot.uniqueID"
          size="100px"
        />
        <div class="title">Would you like to invite</div>
        <div class="name">{{ bot.username }}?</div>
        <div class="head">This Bot Can:</div>
        <div class="perms-list">
          <CheckBox
            v-for="(perm, i) of perms"
            :key="i"
            :checked="true"
            :name="perm.name"
            :description="perm.info"
          />
        </div>
        <CustomButton name="Login To Invite Bot" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/home-page/Header.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CheckBox from "@/components/CheckBox.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { containsPerm, permissions } from "@/constants/rolePermissions";
import User from "@/interfaces/User";
import { getBot } from "@/services/botService";

@Component({
  components: { Header, CheckBox, LoadingScreen, AvatarImage, CustomButton }
})
export default class InviteBot extends Vue {
  bot: User | null = null;
  mounted() {
    getBot(this.botID).then(bot => {
      this.bot = bot;
    });
  }
  get botID() {
    return this.$route.params.botid;
  }
  get permNumber() {
    const str: any = this.$route.query.perms;
    return parseInt(str || "0") || 0;
  }
  get perms() {
    return Object.values(permissions).filter(p =>
      containsPerm(this.permNumber, p.value)
    );
  }
}
</script>

<style scoped lang="scss">
.invite-bot-page {
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  align-content: center;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.title {
  margin-top: 10px;
  opacity: 0.8;
}
.name {
  font-weight: bold;
  margin-bottom: 5px;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.head {
  opacity: 0.6;
  margin-top: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
</style>
