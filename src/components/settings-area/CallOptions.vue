<template>
  <div class="call-options">
    <DropDown
      title="Input Device"
      :items="devices"
      IdPath="deviceId"
      namePath="label"
      :default-id="selectedInputDevice"
      @change="inputDeviceChanged"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropDown from "@/components/CustomDropDown.vue";
export default defineComponent({
  name: "CallOptions",
  components: { DropDown },
  data() {
    return {
      selectedInputDevice: localStorage["inputDeviceId"] || "default",
      devices: [] as MediaDeviceInfo[],
    };
  },
  async mounted() {
    this.devices = await this.getInputDevices();
    console.log(this.devices);
  },
  methods: {
    async getInputDevices() {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
          devices.filter((device) => device.kind === "audioinput")
        );
    },
    inputDeviceChanged(id: any) {
      localStorage["inputDeviceId"] = id;
      this.selectedInputDevice = id;
    },
  },
});
</script>

<style lang="scss" scoped>
.call-options {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
</style>
