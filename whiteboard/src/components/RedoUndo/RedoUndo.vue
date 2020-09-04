<template>
  <div class="redo-undo">
    <div class="redo-undo-controller-btn" @click="this.handleUndo">
      <img :src="undoSteps === 0 ? undoDisabled : undo" />
    </div>
    <div class="redo-undo-controller-btn" @click="this.handleRedo">
      <img :src="redoSteps === 0 ? redoDisabled : redo" />
    </div>
  </div>
</template>

<script>
import redo from "./src/image/redo.svg";
import undo from "./src/image/undo.svg";
import redoDisabled from "./src/image/redo-disabled.svg";
import undoDisabled from "./src/image/undo-disabled.svg";
// import { Step } from "element-ui";

export default {
  name: "RedoUndo",
  props: {
    room: null
  },
  data() {
    return {
      redo,
      undo,
      redoDisabled,
      undoDisabled,
      undoSteps: 0,
      redoSteps: 0
    };
  },

  methods: {
    handleUndo() {
      const { room } = this.data;
      room.undo();
    }
  },
  mounted() {
    const room = this.props;
    room.disableSerialization = false;
    room.callbacks.on("onCanUndoStepsUpdate", steps => {
      this.undoSteps = steps;
    });
    room.callbacks.on("onCanRedoStepsUpdate", steps => {
      this.redoSteps = steps;
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./RedoUndo.less";
</style>
