
import { MeModule } from "@/store/modules/me";
import { findListeningProgram, programListener, restartListener } from "@/utils/programActivity";
import { Component, Vue, Watch } from "vue-property-decorator";


@Component
export default class ElectronActivityHandler extends Vue {
  programActivityTimeout: NodeJS.Timeout | null = null;
  currentActiveProgram: {name: string, status: string} | null = null;
  render() {
    return null
  }
  beforeMount() {
    programListener(this.onActivityChange);
  }

  // functions
  emitActivity() {
    if (!this.isConnected) return;
    this.programActivityTimeout && clearTimeout(this.programActivityTimeout)
    if (MeModule.user.status !== 0) {
      this.$socket.client.emit("programActivity:set", this.currentActiveProgram);
    }
    if (!this.currentActiveProgram) {
      this.programActivityTimeout = null;
      return;
    }
    this.programActivityTimeout = setTimeout(this.emitActivity, 180000); // 3 minutes
  }

  onActivityChange(_filename: string) {
    let filename: any = null;
    if (_filename) {
      filename = _filename;
    }
    const program  = findListeningProgram(filename)
    console.log("Program Running: " + program?.filename);
    this.currentActiveProgram = program;
    this.emitActivity();
  }
  // watchers
  @Watch("isConnected")
  onConnection() {
    restartListener();
  }
  // computed
  get isConnected() {
    return MeModule.connected;
  }

}