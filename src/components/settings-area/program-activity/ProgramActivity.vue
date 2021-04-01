<template>
  <div class="program-activity">
    <div class="box">
      <InformationTemplate
        title="Program Activity"
        information="Share programs or games you are running by adding apps below. This
      will replace your custom status when a program is opened and revert back
      when the program is closed."
      />
      <div class="warn" v-if="!$isElectron">
        To use the program acitivty feature, you must download the Nertivia
        desktop app.
      </div>
      <div class="inner-content" :class="{ disabled: !$isElectron }">
        <div class="program-selector">
          <CustomDropDown
            title="Select Program"
            :items="programs"
            defaultText="Select Program"
            @change="selectedID = $event"
            IdPath="id"
          />
          <CustomButton
            icon="add"
            title="Add Program"
            :disabled="!this.selectedID"
            @click="addProgram"
          />
        </div>
        <div class="title">Listening Programs</div>
        <div class="list">
          <ProgramTemplate
            v-for="item in listeningPrograms"
            @delete="deleteClicked(item.id)"
            @save="saveClicked(item.id, $event)"
            :item="item"
            :key="item.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CustomButton from "@/components/CustomButton.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import ProgramTemplate from "./ProgramTemplate.vue";

import electronBridge from "@/utils/electronBridge";
import {
  addListeningProgram,
  getListeningProgram,
  restartListener
} from "@/utils/programActivity";

@Component({
  components: {
    CustomButton,
    CustomDropDown,
    InformationTemplate,
    ProgramTemplate
  }
})
export default class ProgramActivity extends Vue {
  programs: any = [];
  listeningPrograms: any = [];
  selectedID = null;
  async mounted() {
    if (!this.$isElectron) return;
    this.getData();
  }
  getData() {
    electronBridge
      ?.invoke("get_running_programs", getListeningProgram())
      .then(programs => {
        this.programs = programs.map(p => {
          return {
            name: p.name,
            note: p.filename,
            id: p.filename
          };
        });
        this.programs.unshift({
          name: "Custom",
          note: "Add Your Own",
          id: "custom.exe"
        });
      });
    this.listeningPrograms = getListeningProgram();
    restartListener();
  }
  addProgram() {
    if (!this.selectedID) return;
    const program = this.programs.find(p => p.id === this.selectedID);
    this.selectedID = null;
    addListeningProgram({
      name: program.name,
      filename: program.id,
      status: "Playing",
      id: Math.random().toString()
    });
    this.getData();
  }
  deleteClicked(id: string) {
    let programs = getListeningProgram();
    programs = programs.filter(p => id !== p.id);
    localStorage["programActivity"] = JSON.stringify(programs);
    this.getData();
  }
  saveClicked(id: string, updatedItem) {
    const programs = getListeningProgram();
    const index = programs.findIndex(p => id === p.id);
    if (index === -1) return;
    programs[index] = updatedItem;
    localStorage["programActivity"] = JSON.stringify(programs);
    this.getData();
  }
}
</script>

<style lang="scss" scoped>
.program-activity {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
  margin-bottom: 10px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100%;
}
.check-box {
  margin-bottom: 10px;
}
.disabled {
  opacity: 0.4;
  position: relative;
  &:before {
    content: "";
    cursor: not-allowed;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: 99999;
  }
}
.inner-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.program-selector {
  display: flex;
  width: 100%;
  .input {
    flex: 1;
  }
  .button {
    height: 50px;
    width: 50px;
    flex-shrink: 0;
    margin-top: 7px;
  }
}
.warn {
  border: solid 1px var(--warn-color);
  padding: 5px;
  border-radius: 4px;
  max-width: 600px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
.list {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
