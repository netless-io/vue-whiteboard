<template>
  <div></div>
</template>

<script>
import pencilCursor from "./src/image/pencil-cursor.png";
import selectorCursor from "./src/image/selector-cursor.png";
import eraserCursor from "./src/image/eraser-cursor.png";
import shapeCursor from "./src/image/shape-cursor.svg";
import textCursor from "./src/image/text-cursor.svg";

export default {
  name: "CursorTool",
  props: {
    room: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      pencilCursor,
      selectorCursor,
      eraserCursor,
      shapeCursor,
      textCursor
    };
  }
};
</script>

<style lang="less">
@import "./";
</style>