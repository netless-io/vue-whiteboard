<template>
  <div class="ui-video-seek-slider">
    <div
      @mouseleave="handleTrackHover()"
      @mousemove="handleTrackHover()"
      @mousedown.prevent="setSeeking()"
      @mouseenter="setMobileSeeking()"
    >
      <div class="main"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeekSlider",
  props: {
    onChange: {
      type: Function
    },
    fullTime: {},
    currentTime: {},
    hideHoverTime: {
      type: Boolean
    },
    limitTimeTooltipBySides: {
      type: Boolean
    }
  },
  data() {
    return {
      fullTime: "",
      currentTime: "",
      hideHoverTime: "",
      limitTimeTooltipBySides: "",
      ready: false,
      trackWidth: 0,
      seekHoverPosition: 0,
      seeking: Boolean,
      mobileSeeking: Boolean,
      track: "",
      hoverTime: "",
      offset: 0,
      secondsPrefix: "00:00:",
      minutesPrefix: "00:",
      seekHoverPosition: Number,
      seeking: Boolean,
      transform: ""
    };
  },

  methods: {
    setTrackWidthState() {
      if (this.track) {
        this.trackWidth = this.track.offsetWidth;
      }
    },

    changeCurrentTimePosition(pageX) {
      if (this.track) {
        let positio = pageX - this.track.getBoundingClientRect().left;
        position = position < 0 ? 0 : position;
        position =
          position > this.state.trackWidth ? this.state.trackWidth : position;
        this.seekHoverPosition = position;
        const percent = (position * 100) / this.state.trackWidth;
        const time = +(percent * (this.props.fullTime / 100)).toFixed(0);
        this.onChange(time, time + this.offset);
      }
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

    handleTrackHover(clear, evt) {
      if (this.track) {
        let position = evt.pageX - this.track.getBoundingClientRect().left;
        if (clear) {
          position = 0;
        }
        this.seekHoverPosition = position;
      }
    },

    getPositionStyle() {
      const position = this.trackWidth / (this.fullTime / this.currentTime);
      return {
        transform: `scaleX(${position / 100})`
      };
    },

    getThumbHandlerPosition() {
      const position =
        this.state.trackWidth / (this.props.fullTime / this.props.currentTime);
      return {
        transform: `translateX(${position}px)`
      };
    },

    getSeekHoverPosition() {
      let position = 0;
      if (this.hoverTime) {
        position = this.seekHoverPosition - this.hoverTime.offsetWidth / 2;
        if (this.limitTimeTooltipBySides) {
          if (position < 0) {
            position = 0;
          } else if (position + this.hoverTime.offsetWidth > this.trackWidth) {
            position = this.trackWidth - this.hoverTime.offsetWidth;
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

    mouseSeekingHandler(evt) {
      this.setSeeking(false, event);
    },

    setSeeking(state, evt) {
      // evt.preventDefault();
    }
  },

  mounted() {
    // 程序化的事件侦听器，一次性侦听一个事件
    this.$once("hook:beforeDestroy", function() {
      setTrackWidthState.destroy();
      handleSeeking.destroy();
      mouseSeekingHandler.destroy();
      handleTouchSeeking.destroy();
      mobileTouchSeekingHandler.destroy();
    });
  }

  // beforeDestroy() {
  //   window.removeEventListener("resize", this.setTrackWidthState);
  //   window.removeEventListener("mousemove", this.handleSeeking);
  //   window.removeEventListener("mouseup", this.mouseSeekingHandler);
  //   window.removeEventListener("touchmove", this.handleTouchSeeking);
  //   window.removeEventListener("touchend", this.mobileTouchSeekingHandler);
  // }
};
</script>

<style lang="less">
@import "./SeekSlider.less";
</style>