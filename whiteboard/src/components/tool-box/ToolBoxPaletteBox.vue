<template>
  <div class="palette-box">
    <div class="tool-box-stroke-box">
      <div class="tool-box-input-box">
        <input
          type="range"
          class="palette-stroke-slider"
          min="1"
          max="32"
          @click="setStrokeWidth"
          v-model="roomState.memberState.strokeWidth"
          @mouseup="onMouseUp"
        />
      </div>
      <div class="tool-box-mask-box">
        <img :src="mask" />
      </div>
      <div
        class="tool-box-under-box-2"
        :style="{ width: 156 * percentage + 'px' }"
      ></div>
      <div class="tool-box-under-box"></div>
    </div>
    <div class="stroke-script">
      <div class="stroke-script-text">细</div>
      <div class="stroke-script-text">粗</div>
    </div>
    <div
      :style="{ width: '156px', height: '1px', backgroundColor: '#E7E7E7' }"
    ></div>

    <div class="cell-box">
      <template v-for="item of toolPaletteConfig">
        <div
          class="cell-mid-color"
          :key="item.values"
          :style="{
            borderColor: isMatchColor(hexToRgb(item)) ? '#3381FF' : '#FFFFFF'
          }"
        >
          <div
            class="cell-color"
            @click="selectColor(hexToRgb(item))"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import mask from "./src/image/mask.svg";
export default {
  name: "ToolBoxPaletteBox",
  props: {
    room: {
      type: Object,
      require: true
    },
    roomState: {
      type: Object,
      require: true
    },
    displayStroke: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      mask,
      borderColor: "#FFFFF",
      percentage: this.room.state.memberState.strokeWidth / 32,
      toolPaletteConfig: [
        "#FC3A3F",
        "#FD8343",
        "#FFDA56",
        "#9FDF76",
        "#60E8C6",
        "#57B2FC",
        "#4486F6",
        "#9D27B0",
        "#DC74FC",
        "#939AA8",
        "#1D2129",
        "#FFFFFF"
      ]
    };
  },

  methods: {
    setStrokeWidth(event) {
      const percentage = event.target.value / 32;
      const strokeWidth = parseInt(event.target.value);
      this.percentage = percentage;
      this.room.setMemberState({ strokeWidth: strokeWidth });
    },

    hexToRgb(hex) {
      const rgb = [];
      hex = hex.substr(1);
      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, "$1$1");
      }
      hex.replace(/../g, color => {
        rgb.push(parseInt(color, 0x10));
      });
      return rgb;
    },

    selectColor(newColor) {
      this.room.setMemberState({ strokeColor: newColor });
    },

    isMatchColor(color) {
      const { strokeColor } = this.roomState.memberState;
      return (
        strokeColor[0] === color[0] &&
        strokeColor[1] === color[1] &&
        strokeColor[2] === color[2]
      );
    },

    onMouseUp() {
      this.room.setMemberState({
        strokeWidth: this.roomState.memberState.strokeWidth
      });
    }
  }
};
</script>

<style lang="less">
@import "./ToolBoxPaletteBox.less";
</style>
