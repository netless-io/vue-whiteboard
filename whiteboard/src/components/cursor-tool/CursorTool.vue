<template>
  <div></div>
</template>

<script>
import {
  ApplianceNames,
  Cursor,
  CursorAdapter,
  CursorDescription,
  Player,
  Room,
  RoomMember,
  RoomState
} from "white-web-sdk";
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
      textCursor,
      cursorName: roomMember.payload.cursorName,
      color: `rgb(${roomMember.memberState.strokeColor[0]}, ${roomMember.memberState.strokeColor[1]}, ${roomMember.memberState.strokeColor[2]})`
    };
  }
};
</script>

<style lang="less">
@import "./";
</style>