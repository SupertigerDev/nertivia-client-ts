<template>
  <div class="program-item">
    <div class="left">
      <div class="grouped-input">
        <CustomInput
          prefixIcon="games"
          title="Status"
          class="status-input"
          v-model="newStatus"
        />
        <CustomInput
          prefixIcon="create"
          title="Name"
          class="name-input"
          v-model="newName"
        />
      </div>
      <CustomInput
        prefixIcon="description"
        title="Filename"
        class="filename-input"
        v-model="newFilename"
      />
    </div>
    <div class="buttons">
      <CustomButton
        :alert="true"
        icon="delete"
        @click="$emit('delete')"
        name="Delete"
      />
      <CustomButton icon="save" name="Save" @click="saveButton" />
    </div>
  </div>
</template>

<script lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { defineComponent, PropType } from "vue";
interface Item {
  id: string;
  status: boolean;
  name: string;
  filename: string;
}
export default defineComponent({
  name: "ProgramTemplate",
  components: { CustomButton, CustomInput },
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  data() {
    return {
      newStatus: this.item.status,
      newName: this.item.name,
      newFilename: this.item.filename,
    };
  },
  methods: {
    saveButton() {
      this.$emit("save", {
        status: this.newStatus,
        name: this.newName,
        filename: this.newFilename,
        id: this.item.id,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.program-item {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  margin: 10px;
  padding: 5px;
  border-radius: 4px;
}
.buttons {
  display: flex;
  margin-left: auto;
  margin-top: auto;
}
.block {
  display: flex;
  .title {
    margin-right: 3px;
  }
  .name {
    opacity: 0.6;
  }
}
.grouped-input {
  display: flex;
  max-width: 300px;
  .status-input {
    width: 120px;
  }
  .name-input {
    flex: 1;
  }
}
.filename-input {
  max-width: 300px;
  margin-top: -15px;
}
@media (max-width: 540px) {
  .program-item {
    flex-direction: column;
  }
}
</style>
