<template>
  <div class="redo-undo">
    <div class="redo-undo-controller-btn" @click="handleUndo">
      <img :src="undoSteps === 0 ? undoDisabled : undo" />
    </div>
    <div class="redo-undo-controller-btn" @click="handleRedo">
      <img :src="redoSteps === 0 ? redoDisabled : redo" />
    </div>
  </div>
</template>

<script>
import redo from "./src/image/redo.svg";
import undo from "./src/image/undo.svg";
import redoDisabled from "./src/image/redo-disabled.svg";
import undoDisabled from "./src/image/undo-disabled.svg";

export default {
  name: "RedoUndo",
  props: {
    room: {
      type: Object
    }
  },
  data() {
    return {
      redo,
      undo,
      redoDisabled,
      undoDisabled,
      undoSteps: 0,
      redoSteps: 0,
      disableSerialization: Boolean
      // Room: this.room
    };
  },

  methods: {
    handleUndo() {
      const { room } = this.props;
      console.log(room);
      room.undo();
    },

    handleRedo() {
      const { room } = this.props;
      console.log(room);
      room.redo();
    }
  },
  mounted() {
    const room = this.room;
    console.log(this.room);
    console.log(room);
    room.disableSerialization = false;
    room.callbacks.on("onCanUndoStepsUpdate", steps => {
      this.undoSteps = steps;
    });
    room.callbacks.on("onCanRedoStepsUpdate", steps => {
      this.redoSteps = steps;
    });
  },
  beforeMount() {
    const room = this.room;
    console.log(this.room);
    console.log(room);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./RedoUndo.less";
</style>
