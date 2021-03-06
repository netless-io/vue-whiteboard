<template>
  <div class="tool-mid-box-left">
    <template v-for="item in descriptions.applianceName">
      <template v-if="item.hasColor">
        <el-popover
          placement="right"
          trigger="click"
          :key="item.values"
          @click="onVisibleChange(extendsPanel)"
        >
          <template v-if="item.hasColor">
            <tool-box-palette-box
              :room="roomData"
              :roomState="roomState"
              :displayStroke="item.hasStroke"
            ></tool-box-palette-box>
          </template>
          <el-tooltip placement="right" :content="item.name" slot="reference">
            <div class="tool-box-cell-box-left">
              <div
                class="tool-box-cell"
                @click.prevent="event => clickAppliance(event, item.name)"
              >
                <img
                  @click="changeIcon(item.name)"
                  :src="isSelected === item.name ? item.iconActive : item.icon"
                />
              </div>
            </div>
          </el-tooltip>
        </el-popover>
      </template>
      <template v-else>
        <el-tooltip
          :key="item.values"
          placement="right"
          :content="item.name"
          slot="reference"
        >
          <div class="tool-box-cell-box-left">
            <div
              class="tool-box-cell"
              @click.prevent="event => clickAppliance(event, item.name)"
            >
              <img
                @click="changeIcon(item.name)"
                :src="isSelected === item.name ? item.iconActive : item.icon"
              />
            </div>
          </div>
        </el-tooltip>
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
import ToolBoxPaletteBox from "./ToolBoxPaletteBox";
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
import mask from "./image/mask.svg";
export default {
  name: "ToolBox",
  components: {
    ToolBoxPaletteBox
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
      mask,
      strokeEnable: false,
      extendsPanel: false,
      roomData: this.room,
      roomState: this.room.state,
      isSelected: this.room.state.memberState.currentApplianceName,
      descriptions: {
        applianceName: Object.freeze({
          selector: Object.freeze({
            name: "selector",
            icon: selector,
            iconActive: selectorActive,
            // hasColor: false,
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
            // hasColor: false,
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
            // hasColor: false,
            hasStroke: false
          }),
          hand: Object.freeze({
            name: "hand",
            icon: hand,
            iconActive: handActive,
            // hasColor: false,
            hasStroke: false
          })
        })
      }
    };
  },

  methods: {
    changeIcon(value) {
      this.isSelected = value;
    },

    clickAppliance(eventTarget, applianceName) {
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
