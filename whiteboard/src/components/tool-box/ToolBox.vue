<template>
  <div></div>
</template>

<script>
import selector from "./image/selector.svg";
import selectorActive from "./image/selector-active.svg";
import pen from "./image/pencil.svg";
import penActive from "./image/pencil-active.svg";
import text from "./image/text.svg";
import textActive from "./image/text-active.svg";
import eraser from "./image/eraser.svg";
import eraserActive from "./image/eraser-active.svg";
import ellipse from "./image/ellipse.svg";
import ellipseActive from "./image/ellipse-active.svg";
import rectangle from "./image/rectangle.svg";
import rectangleActive from "./image/rectangle-active.svg";
import straight from "./image/straight.svg";
import straightActive from "./image/straight-active.svg";
import arrow from "./image/arrow.svg";
import arrowActive from "./image/arrow-active.svg";
import laserPointer from "./image/laserPointer.svg";
import laserPointerActive from "./image/laserPointer-active.svg";
import hand from "./image/hand.svg";
import handActive from "./image/hand-active.svg";
export default {
  name: "ToolBox",
  data() {
    return {
      selector,
      selectorActive,
      pen,
      penActive,
      text,
      textActive,
      eraser,
      eraserActive,
      ellipse,
      ellipseActive,
      rectangle,
      rectangleActive,
      straight,
      straightActive,
      arrow,
      arrowActive,
      laserPointer,
      laserPointerActive,
      hand,
      handActive
    };
  }
};
</script>

<style lang="less">
@import "./ToolBox.less";
</style>