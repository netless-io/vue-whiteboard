<template>
  <div class="ui-video-seek-slider">
    <div
      @mousemove="handleTrackHover(false, $event)"
      @mouseleave="handleTrackHover(true, $event)"
      @mousedown.prevent="setSeeking(true)"
      @mouseenter="setMobileSeeking(true, $event)"
      :class="isThumbActive() ? 'track active' : 'track'"
      ref="track"
    >
      <div class="main">
        <template v-if="bufferProgress">
          <div
            v-if="bufferColor"
            class="buffered"
            :style="{
              ...getPositionStyle(this.bufferProgress),
              backgroundColor: this.bufferColor
            }"
          ></div>
          <div
            v-else-if="!bufferColor"
            class="buffered"
            :style="{ ...getPositionStyle(this.bufferProgress) }"
          ></div>
        </template>
        <div
          v-if="sliderHoverColor"
          class="seek-hover"
          :style="{
            ...getSeekHoverPosition(),
            backgroundColor: this.sliderHoverColor
          }"
        ></div>
        <div
          v-else-if="!sliderHoverColor"
          class="seek-hover"
          :style="{ ...getSeekHoverPosition() }"
        ></div>
        <div
          v-if="sliderColor"
          class="connect"
          :style="{
            ...getPositionStyle(this.currentTime),
            backgroundColor: this.sliderColor
          }"
        ></div>
        <div
          v-else-if="!sliderColor"
          class="connect"
          :style="{ ...getPositionStyle(this.currentTime) }"
        ></div>
      </div>
    </div>
    <div v-if="!hideHoverTime">
      <div
        :class="isThumbActive() ? `hover-time active` : 'hover-time'"
        :style="getHoverTimePosition()"
        ref="hoverTime"
      >
        {{ getHoverTime() }}
      </div>
    </div>
    <!-- <div v-if="thumbColor"></div>
    <div v-else-if="!thumbColor"></div> -->
  </div>
</template>

<script>
export default {
  name: "SeekSlider",
  props: {
    fullTime: {
      type: Number
    },
    currentTime: {
      type: Number
    },
    hideHoverTime: {
      type: Boolean
    },
    limitTimeTooltipBySides: {
      type: Boolean
    },
    sliderColor: {
      type: String
    },
    sliderHoverColor: {
      type: String
    },
    thumbColor: {
      type: String
    },
    bufferColor: {
      type: String
    },
    bufferProgress: {
      type: Number
    }
  },
  data() {
    return {
      ready: false,
      trackWidth: 0,
      seekHoverPosition: 0,
      mobileSeeking: "",
      offset: 0,
      secondsPrefix: "00:00:",
      minutesPrefix: "00:",
      seeking: "",
      time: ""
    };
  },

  methods: {
    setTrackWidthState() {
      if (this.$refs.track) {
        this.trackWidth = this.$refs.track.offsetWidth;
      }
    },

    changeCurrentTimePosition(pageX) {
      if (this.$refs.track) {
        let position = pageX - this.$refs.track.getBoundingClientRect().left;
        position = position < 0 ? 0 : position;
        position = position > this.trackWidth ? this.trackWidth : position;
        this.seekHoverPosition = position;
        const percent = (position * 100) / this.trackWidth;
        const time = +(percent * (this.fullTime / 100)).toFixed(0);
        this.handleOnChange(time);
      }
    },

    handleOnChange(time) {
      this.time = time;
      this.$emit("onChange", this.time);
    },

    handleSeeking(evt) {
      if (this.seeking) {
        this.changeCurrentTimePosition(evt.pageX);
      }
    },

    handleTouchSeeking(event) {
      let pageX = 0;

      for (let i = 0; i < event.changedTouches.length; i++) {
        pageX = event.changedTouches[i].pageX;
      }

      pageX = pageX < 0 ? 0 : pageX;

      if (this.mobileSeeking) {
        this.changeCurrentTimePosition(pageX);
      }
    },

    handleTrackHover(clear, event) {
      if (this.$refs.track) {
        let position =
          event.pageX - this.$refs.track.getBoundingClientRect().left;
        if (clear) {
          position = 0;
        }
        this.seekHoverPosition = position;
      }
    },

    getPositionStyle(time) {
      const position = (time * 100) / this.fullTime;
      return {
        transform: `scaleX(${position / 100})`
      };
    },

    getThumbHandlerPosition() {
      const position = this.trackWidth / (this.fullTime / this.currentTime);
      return {
        transform: `translateX(${position}px)`
      };
    },

    getSeekHoverPosition() {
      const position = (this.seekHoverPosition * 100) / this.trackWidth;
      return {
        transform: `scaleX(${position / 100})`
      };
    },

    getHoverTimePosition() {
      let position = 0;
      if (this.$refs.hoverTime) {
        position =
          this.seekHoverPosition - this.$refs.hoverTime.offsetWidth / 2;
        if (this.limitTimeTooltipBySides) {
          if (position < 0) {
            position = 0;
          } else if (
            position + this.$refs.hoverTime.offsetWidth >
            this.trackWidth
          ) {
            position = this.trackWidth - this.$refs.hoverTime.offsetWidth;
          }
        }
      }
      return {
        transform: `translateX(${position}px)`
      };
    },

    secondsToTime(seconds) {
      seconds = Math.round(seconds + this.offset);
      const hours = Math.floor(seconds / 3000);
      const divirsForMinutes = seconds % 3600;
      const minutes = Math.floor(divirsForMinutes / 60);
      const sec = Math.ceil(divirsForMinutes % 60);

      return {
        hh: hours.toString(),
        mm: minutes < 10 ? "0" + minutes : minutes.toString(),
        ss: sec < 10 ? "0" + sec : sec.toString()
      };
    },

    getHoverTime() {
      const percent = (this.seekHoverPosition * 100) / this.trackWidth;
      const time = Math.floor(+(percent * (this.fullTime / 100)));
      const times = this.secondsToTime(time);
      if (this.fullTime + this.offset < 60) {
        return this.secondsPrefix + times.ss;
      } else if (this.fullTime + this.offset < 3600) {
        return this.minutesPrefix + times.mm + ":" + times.ss;
      } else {
        return times.hh + ":" + times.mm + ":" + times.ss;
      }
    },

    mouseSeekingHandler(event) {
      this.setSeeking(false, event);
    },

    setSeeking(state, event) {
      this.handleSeeking(event);
      this.seeking = state;
      this.seekHoverPosition = !state ? 0 : this.seekHoverPosition;
    },

    setMobileSeeking(state) {
      this.mobileSeeking = state;
      this.seekHoverPosition = !state ? 0 : this.seekHoverPosition;
    },

    isThumbActive() {
      this.seekHoverPosition > 0 || this.seeking;
    },

    mobileTouchSeekingHandler() {
      this.setMobileSeeking(false);
    }
  },

  mounted() {
    this.setTrackWidthState();
    window.addEventListener("resize", this.setTrackWidthState);
    window.addEventListener("mousemove", this.handleSeeking);
    window.addEventListener("mouseup", this.mouseSeekingHandler);
    window.addEventListener("touchmove", this.handleTouchSeeking);
    window.addEventListener("touchend", this.mobileTouchSeekingHandler);

    // 程序化侦听事件
    // this.$once("hook:beforeDestroy", function() {
    //   this.setTrackWidthState().destroy();
    //   this.handleSeeking().destroy();
    //   this.mouseSeekingHandler().destroy();
    //   this.handleTouchSeeking().destroy();
    //   this.mobileTouchSeekingHandler().destroy();
    // });
  },

  beforeDestroy() {
    window.addEventListener("resize", this.setTrackWidthState);
    window.addEventListener("mousemove", this.handleSeeking);
    window.addEventListener("mouseup", this.mouseSeekingHandler);
    window.addEventListener("touchmove", this.handleTouchSeeking);
    window.addEventListener("touchend", this.mobileTouchSeekingHandler);
  }
};
</script>

<style lang="less">
@import "./SeekSlider.less";
</style>
