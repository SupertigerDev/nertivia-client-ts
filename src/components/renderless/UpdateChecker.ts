import { AppUpdateModule } from "@/store/modules/appUpdate";
import { PopoutsModule } from "@/store/modules/popouts";
import WindowProperties from "@/utils/windowProperties";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class UpdateChecker extends Vue {
  lastUpdateChecked = Date.now();
  updateAvailable = false;
  checkAfter = 600000; // 60 minutes

  render() {
    return null;
  }
  mounted() {
    this.showChangelog();
  }
  // functions
  // show changelog if it was not seen.
  showChangelog() {
    const seenVersion = localStorage["changelogSeenVersion"];
    if (!seenVersion) {
      localStorage["changelogSeenVersion"] = this.$version;
      return;
    }
    if (seenVersion === this.$version) return;
    localStorage["changelogSeenVersion"] = this.$version;
    PopoutsModule.ShowPopout({
      id: "changelog-popout",
      component: "ChangelogPopout"
    });
  }
  // watchers
  @Watch("focused")
  onFocusChange() {
    AppUpdateModule.check();
  }
  // computed
  get focused() {
    return WindowProperties.isFocused;
  }
}
