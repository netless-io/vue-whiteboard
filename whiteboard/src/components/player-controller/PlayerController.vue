<template>
  <div class="player-schedule">
    <div class="player-mid-box">
      <!-- SeekSlider -->
    </div>
    <div class="player-controller-box">
      <div class="player-controller-mid">
        <div class="player-left-box">
          <div class="player-controller" @click="onClickOperationButton(player)">
            <template v-if="PlayerPhase === defaultPhase">
              <img :src="video_play" />
            </template>
            <template v-else-if="PlayerPhase === Buffering">
              <img :src="video_pause" />
            </template>
            <template v-else-if="PlayerPhase === Playing">
              <img :src="video_pause" />
            </template>
          </div>
          <div class="player-mid-box-time"></div>
        </div>
        <el-dropdown placement="top-start">
          <span class="el-dropdown-link">倍数</span>
          <el-dropdown-menu slot="dropdown" class="player-menu-box">
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(2.0)">2.0x</el-dropdown-item>
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(1.5)">1.5x</el-dropdown-item>
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(1.25)">1.25x</el-dropdown-item>
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(1.0)">1.0x</el-dropdown-item>
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(0.75)">0.75x</el-dropdown-item>
            <el-dropdown-item class="player-menu-cell" @click="handleActiveMultiple(0.5)">0.5x</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import video_play from "./src/image/video_play.svg";
import video_pause from "./src/image/video_pause.svg";
// import { PlayerPhase } from 'white-web-sdk';

export default {
  name: "PlayerController",
  props: {
    player: {
      require: true
    }
  },
  data() {
    return {
      video_play,
      video_pause,
      progressTime: 0,
      // phase: player.phase,
      isPlayerSeeking: false,
      currentTime: 0,
      multiple: playbackSpeed,
      PlayerPhase: "defaultPhase"
    };
  },

  methods: {},

  mounted() {
    this.player.callbacks.on("onPhaseChanged", phase => {
      this.phase = phase;
    });

    this.player.callbacks.on("onProgressTimeChanged", currentTime => {
      this.currentTime = currentTime;
    });
  },

  onClickOperationButton(player) {
    switch (this.player.phase) {
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
    this.player.playbackSpeed = multiple;
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