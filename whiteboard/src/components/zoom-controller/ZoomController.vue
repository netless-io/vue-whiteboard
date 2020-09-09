<template>
  <div class="scale-controller-box">
    <div class="scale-controller-btn" @click="moveTo100">
      <img :src="reset" />
    </div>
    <div class="scale-controller-cut-line" />
    <div class="scale-controller-btn" @click="moveRuleIndex(-1)">
      <img :src="less" />
    </div>
    <div>
      {{Math.ceil(roomState.zoomScale * 100)}}
      <span :style="styleObject">%</span>
    </div>
    <div class="scale-controller-btn" @click="moveRuleIndex(+1)">
      <img :src="plus" />
    </div>
  </div>
</template>

<script>
import reset from "./src/image/reset.svg";
import plus from "./src/image/plus.svg";
import less from "./src/image/less.svg";

export default {
  name: "ZoomController",
  props: {
    room: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      reset,
      plus,
      less,
      scaleAnimation: true,
      reverseState: false,
      isMouseOn: false,
      roomState: this.room.state,
      tempRuleIndex: Number,
      syncRuleIndexTimer: null,
      syncDuration: 200,
      dividingRule: [
        0.10737418240000011,
        0.13421772800000012,
        0.16777216000000014,
        0.20971520000000016,
        0.26214400000000015,
        0.3276800000000002,
        0.4096000000000002,
        0.5120000000000001,
        0.6400000000000001,
        0.8,
        1,
        1.26,
        1.5876000000000001,
        2.000376,
        2.5204737600000002,
        3.1757969376000004,
        4.001504141376,
        5.041895218133761,
        6.352787974848539,
        8.00451284830916,
        10
      ],
      styleObject: {
        opacity: 0.6
      }
    };
  },

  methods: {
    delaySyncRuleIndex() {
      if (this.syncRuleIndexTimer !== null) {
        clearTimeout(this.syncRuleIndexTimer);
        this.syncRuleIndexTimer = null;
      }
      this.syncRuleIndexTimer = setTimeout(() => {
        this.syncRuleIndexTimer = null;
        this.tempRuleIndex = undefined;
      }, this.syncDuration);
    },

    readRuleIndexByScale(scale) {
      if (scale < this.dividingRule[0]) {
        return 0;
      }
      for (let i = 0; i < this.dividingRule.length; ++i) {
        const prePoint = this.dividingRule[i - 1];
        const point = this.dividingRule[i];
        const nextPoint = this.dividingRule[i + 1];
        const begin =
          prePoint === undefined
            ? Number.MIN_SAFE_INTEGER
            : (prePoint + point) / 2;
        const end =
          nextPoint === undefined
            ? Number.MAX_SAFE_INTEGER
            : (nextPoint + point) / 2;
        if (scale >= begin && scale <= end) {
          return i;
        }
      }
      return this.dividingRule.length - 1;
    },

    moveTo100() {
      this.tempRuleIndex = this.readRuleIndexByScale(1);
      this.delaySyncRuleIndex();
      this.zoomChange(1);
    },

    zoomChange(scale) {
      this.room.moveCamera({
        centerX: 0,
        centerY: 0,
        scale: scale
      });
    },

    arrowControllerHotKey(evt) {
      if (evt.key === "=" && evt.ctrlKey) {
        this.moveRuleIndex(+1);
      } else if (evt.key === "-" && evt.ctrlKey) {
        this.moveRuleIndex(-1);
      }
    },

    moveRuleIndex(deltaIndex) {
      if (this.tempRuleIndex === undefined) {
        this.tempRuleIndex = this.readRuleIndexByScale(
          this.roomState.zoomScale
        );
      }
      this.tempRuleIndex += deltaIndex;

      if (this.tempRuleIndex > this.dividingRule.length - 1) {
        this.tempRuleIndex = this.dividingRule.length - 1;
      } else if (this.tempRuleIndex < 0) {
        this.tempRuleIndex = 0;
      }
      const targetScale = this.dividingRule[this.tempRuleIndex];

      this.delaySyncRuleIndex();
      this.zoomChange(targetScale);
    }
  },

  mounted() {
    this.room.disableSerialization = false;
    this.room.callbacks.on("onRoomStateChanged", modifyState => {
      this.roomState = { ...this.room.state, ...modifyState };
    });
    document.body.addEventListener("keydown", this.arrowControllerHotKey);
  },

  beforeMount() {
    document.body.removeEventListener("keydown", this.arrowControllerHotKey);
  }
};
</script>

<style lang="less">
@import "./ZoomController.less";
</style>