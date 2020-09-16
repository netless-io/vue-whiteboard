<template>
  <div></div>
</template>

<script>
import video_play from "./src/image/video_play.svg";
import video_pause from "./src/image/video_pause.svg";
// import { PlayerPhase } from 'white-web-sdk';

export default {
  name: "PlayerController",
  data() {
    return {
      video_play,
      video_pause,
      progressTime: 0,
      // phase: player.phase,
      isPlayerSeeking: false,
      currentTime: 0,
      multiple: playbackSpeed
    };
  },

  methods: {},

  mounted() {
    player.callbacks.on("onPhaseChanged", phase => {
      this.phase = phase;
    });

    player.callbacks.on("onProgressTimeChanged", currentTime => {
      this.currentTime = currentTime;
    });
  },

  onClickOperationButton(player) {
    switch (phase) {
      case WaitingFirstFrame:
      case Pause: {
        play();
        break;
      }
      case Playing: {
        pause();
        break;
      }
      case Ended: {
        seekToProgressTime();
        break;
      }
    }
  },

  getCurrentTime(progressTime) {
    if (this.isPlayerSeeking) {
      this.progressTime = progressTime;
      return this.currentTime;
    } else {
      const isChange = this.progressTime !== progressTime;
      if (isChange) {
        return progressTime;
      } else {
        return this.currentTime;
      }
    }
  },

  handleMultiplePlay(multiple) {
    player.playbackSpeed = multiple;
  },

  handleActiveMultiple(multiple) {
    this.handleMultiplePlay(multiple);
    this.multiple = multiple;
  }
};
</script>

<style lang="less">
@import "./PlayerController";
</style>