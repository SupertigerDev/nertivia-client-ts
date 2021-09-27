import { MeModule } from "@/store/modules/me";
import {
  findListeningProgram,
  programListener,
  restartListener,
} from "@/utils/programActivity";
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "ElectronActivityHandler",
  data() {
    return {
      programActivityTimeout: null as number | null,
      currentActiveProgram: null as { name: string; status: string } | null,
    };
  },
  render() {
    return h("template");
  },
  computed: {
    isConnected(): any {
      return MeModule.connected;
    },
  },
  watch: {
    isConnected: {
      handler: "onConnection",
    },
  },
  beforeMount() {
    programListener(this.onActivityChange);
  },
  methods: {
    emitActivity() {
      if (!this.isConnected) return;
      this.programActivityTimeout && clearTimeout(this.programActivityTimeout);
      if (MeModule.user.status !== 0) {
        this.$socket.emit("programActivity:set", this.currentActiveProgram);
      }
      if (!this.currentActiveProgram) {
        this.programActivityTimeout = null;
        return;
      }
      this.programActivityTimeout = window.setTimeout(
        this.emitActivity,
        180000
      ); // 3 minutes
    },
    onActivityChange(_filename: string) {
      let filename: any = null;
      if (_filename) {
        filename = _filename;
      }
      const program = findListeningProgram(filename);
      console.log("Program Running: " + program?.filename);
      this.currentActiveProgram = program;
      this.emitActivity();
    },
    onConnection() {
      restartListener();
    },
  },
});
