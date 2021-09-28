<template>
  <div class="content">
    <InformationTemplate
      class="desc"
      :title="$t('settings.account.more-profile')"
      :information="$t('settings.account.more-profile-notice')"
    />
    <div class="box" v-if="aboutMe !== null">
      <CustomInput
        :error="errors['name']"
        title="Name"
        v-model="name"
        prefixIcon="face"
      />
      <CustomDropDown
        title="Gender"
        :defaultId="gender"
        :items="genders"
        @change="gender = $event"
        IdPath="name"
      />
      <CustomDropDown
        title="Age"
        :defaultId="age"
        :items="ageGroups"
        @change="age = $event"
        IdPath="name"
      />

      <CustomDropDown
        title="Continent"
        :defaultId="continent"
        :items="continents"
        @change="continent = $event"
        IdPath="name"
      />
      <CustomDropDown
        title="Country"
        v-if="filteredCountries.length"
        :defaultId="country"
        :items="filteredCountries"
        @change="country = $event"
        IdPath="name"
      />
      <CustomInput
        title="Other"
        placeholder="I have 10 pretty cats."
        :error="errors['about_me']"
        v-model="about_me"
        :textArea="true"
        prefixIcon="info"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import { ageGroups, continents, countries, genders } from "@/utils/surveyItems";
import { fetchUser, updateSurvay } from "@/services/userService";
import { defineComponent } from "vue";
import { MeModule } from "@/store/modules/me";
export default defineComponent({
  name: "MoreProfile",
  components: {
    CustomInput,
    InformationTemplate,
    CustomDropDown,
  },
  data() {
    return {
      aboutMe: null as any,
      about_me: "",
      name: "",
      gender: "",
      age: "",
      continent: "",
      country: "",
      errors: {} as any,
      genders: genders,
      ageGroups: ageGroups,
      continents: continents,
      countries: countries,
    };
  },
  mounted() {
    if (!MeModule.user.id) return;
    fetchUser(MeModule.user.id).then((user) => {
      this.aboutMe = user.user.about_me;
      this.about_me = this.aboutMe?.about_me || "";
      this.name = this.aboutMe?.name || "";
      this.gender = this.aboutMe?.gender || "";
      this.age = this.aboutMe?.age || "";
      this.continent = this.aboutMe?.continent || "";
      this.country = this.aboutMe?.country || "";
    });
  },
  computed: {
    filteredCountries(): any {
      if (!this.continent || this.continent === "Rather not say") {
        return [];
      }
      const continent = continents.find((c) => c.name === this.continent);
      if (!continent) return [];
      return countries.filter(
        (c) => c.code === continent.code || c.code === "no"
      );
    },
    changesMade(): any {
      if (this.name !== (this.aboutMe?.name || "")) return true;
      if (this.gender !== (this.aboutMe?.gender || "")) return true;
      if (this.age !== (this.aboutMe?.age || "")) return true;
      if (this.continent !== (this.aboutMe?.continent || "")) return true;
      if (this.country !== (this.aboutMe?.country || "")) return true;
      if (this.about_me !== (this.aboutMe?.about_me || "")) return true;
      return false;
    },
  },
  methods: {
    onNext() {
      if (!this.changesMade) {
        this.$emit("onAction", true);
        return;
      }
      this.save();
    },
    save() {
      this.errors = {};
      updateSurvay({
        about_me: this.about_me,
        age: this.age,
        continent: this.continent,
        country: this.country,
        gender: this.gender,
        name: this.name,
      })
        .then(() => {
          this.$emit("onAction", true);
        })
        .catch(async (err) => {
          this.$emit("onAction", false);

          const { errors } = await err.response.json();
          errors.forEach((e) => {
            this.errors[e.param] = e.msg;
          });
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  align-content: center;
}
.box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-left: 5px;
}
.desc {
  margin-left: 10px;
  margin-top: 10px;
}
</style>
