<template>
  <div>
    <template v-for="item in descriptions.applianceName">
      <el-popover placement="right" trigger="click" :key="item.values">
        <!-- :displayStroke="isExtendable" -->
        <!-- <tool-box-palette-box
          :room="room"
          :roomState="roomState"
        ></tool-box-palette-box> -->
        <el-tooltip placement="right" :content="item.name" slot="reference">
          <!-- v-if="isExtendable && isSelected" -->
          <div class="tool-box-cell-box-left">
            <div
              class="tool-box-cell"
              @click="clickAppliance(event, applianceName)"
            >
              <img :src="item.icon" />
            </div>
          </div>
        </el-tooltip>
      </el-popover>
    </template>
  </div>
</template>

<script>
// import ToolBoxPaletteBox from "./ToolBoxPaletteBox";
// import { ApplianceNames, RoomState } from "white-web-sdk";
import selector from "./src/image/selector.svg";
import selectorActive from "./src/image/selector-active.svg";
import pen from "./src/image/pencil.svg";
import penActive from "./src/image/pencil-active.svg";
import text from "./src/image/text.svg";
import textActive from "./src/image/text-active.svg";
import eraser from "./src/image/eraser.svg";
import eraserActive from "./src/image/eraser-active.svg";
import ellipse from "./src/image/ellipse.svg";
import ellipseActive from "./src/image/ellipse-active.svg";
import rectangle from "./src/image/rectangle.svg";
import rectangleActive from "./src/image/rectangle-active.svg";
import straight from "./src/image/straight.svg";
import straightActive from "./src/image/straight-active.svg";
import arrow from "./src/image/arrow.svg";
import arrowActive from "./src/image/arrow-active.svg";
import laserPointer from "./src/image/laserPointer.svg";
import laserPointerActive from "./src/image/laserPointer-active.svg";
import hand from "./src/image/hand.svg";
import handActive from "./src/image/hand-active.svg";
export default {
  name: "ToolBox",
  components: {
    // ToolBoxPaletteBox
  },
  props: {
    room: {
      type: Object,
      require: true
    }
  },
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
      handActive,
      strokeEnable: false,
      extendsPanel: false,
      roomState: this.room.state,
      // isSelected:
      //   this.room.state.memberState.currentApplianceName ===
      //   this.descriptions.applianceName,
      // isExtendable: this.descriptions.hasStroke || this.descriptions.hasColor,
      descriptions: {
        applianceName: Object.freeze({
          selector: Object.freeze({
            name: "selector",
            icon: selector,
            iconActive: selectorActive,
            hasColor: false,
            hasStroke: false
          }),
          pencil: Object.freeze({
            name: "pencil",
            icon: pen,
            iconActive: penActive,
            hasColor: true,
            hasStroke: true
          }),
          text: Object.freeze({
            name: "text",
            icon: text,
            iconActive: textActive,
            hasColor: true,
            hasStroke: false
          }),
          eraser: Object.freeze({
            name: "eraser",
            icon: eraser,
            iconActive: eraserActive,
            hasColor: false,
            hasStroke: false
          }),
          ellipse: Object.freeze({
            name: "ellipse",
            icon: ellipse,
            iconActive: ellipseActive,
            hasColor: true,
            hasStroke: true
          }),
          rectangle: Object.freeze({
            name: "rectangle",
            icon: rectangle,
            iconActive: rectangleActive,
            hasColor: true,
            hasStroke: true
          }),
          straight: Object.freeze({
            name: "straight",
            icon: straight,
            iconActive: straightActive,
            hasColor: true,
            hasStroke: true
          }),
          arrow: Object.freeze({
            name: "arrow",
            icon: arrow,
            iconActive: arrowActive,
            hasColor: true,
            hasStroke: true
          }),
          laserPointer: Object.freeze({
            name: "laserPointer",
            icon: laserPointer,
            iconActive: laserPointerActive,
            hasColor: false,
            hasStroke: false
          }),
          hand: Object.freeze({
            name: "hand",
            icon: hand,
            iconActive: handActive,
            hasColor: false,
            hasStroke: false
          })
        })
      }
    };
  },

  methods: {
    clickAppliance(eventTarget, applianceName) {
      // eventTarget.preventDefault();  Later add prevent Event
      this.room.setMemberState({ currentApplianceName: applianceName });
      this.extendsPanel = true;
    },

    onVisibleChange(visible) {
      if (!visible) {
        this.extendsPanel = false;
      }
    }
  },

  mounted() {
    this.room.callbacks.on("onRoomStateChanged", modifyState => {
      this.roomState = { ...this.room.state, ...modifyState };
    });
  }
};
</script>

<style lang="less">
@import "./ToolBox.less";
</style>