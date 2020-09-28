<template>
  <div class="player-schedule">
    <div class="player-mid-box">
      <seek-slider
        :fullTime="this.player.timeDuration"
        :currentTime="getCurrentTime(this.currentTime)"
        :hideHoverTime="true"
        @onChange="
          time => {
            if (player) {
              this.currentTime = time;
              player.seekToProgressTime(time);
            }
          }
        "
        :limitTimeTooltipBySides="true"
      ></seek-slider>
    </div>
    <div class="player-controller-box">
      <div class="player-controller-mid">
        <div class="player-left-box">
          <div
            class="player-controller"
            @click="onClickOperationButton(player)"
          >
            <div v-if="changePhase">
              <img :src="video_play" :style="{ marginLeft: 2 }" />
            </div>
            <div v-else-if="changePhase === pause">
              <img :src="video_pause" />
            </div>
            <div v-else-if="phase === PlayerPhase.Playing">
              <img :src="video_pause" />
            </div>
          </div>
          <div class="player-mid-box-time">
            {{ showProgressTime }} /
            {{ showTime }}
          </div>
        </div>
        <el-dropdown placement="top-start">
          <span class="el-dropdown-link">倍数</span>
          <el-dropdown-menu slot="dropdown" class="player-menu-box">
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(2.0)"
              >2.0x</el-dropdown-item
            >
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(1.5)"
              >1.5x</el-dropdown-item
            >
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(1.25)"
              >1.25x</el-dropdown-item
            >
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(1.0)"
              >1.0x</el-dropdown-item
            >
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(0.75)"
              >0.75x</el-dropdown-item
            >
            <el-dropdown-item
              class="player-menu-cell"
              @click="handleActiveMultiple(0.5)"
              >0.5x</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import video_play from "./src/image/video_play.svg";
import video_pause from "./src/image/video_pause.svg";
import SeekSlider from "./SeekSlider";
import { PlayerPhase } from "white-web-sdk";
// import { PlayerPhase } from "../../PlayerPhase";
import { displayWatch } from "./WatchDisplay";

export default {
  name: "PlayerController",
  components: {
    SeekSlider
  },
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
      phase: PlayerPhase,
      changePhase: "playing",
      // phase: this.player.phase,
      isPlayerSeeking: false,
      currentTime: 0,
      multiple: this.player.playbackSpeed,
      showTime: displayWatch(Math.floor(this.player.timeDuration / 1000)),
      showProgressTime: displayWatch(
        Math.floor(this.player.progressTime / 1000)
      )
    };
  },

  methods: {
    onClickOperationButton(player) {
      switch (this.player.phase) {
        case PlayerPhase.WaitingFirstFrame:
        case PlayerPhase.Pause: {
          // this.changePhase = "pause";
          player.play();
          break;
        }
        case PlayerPhase.Playing: {
          // this.changePhase = "playing";
          player.pause();
          break;
        }
        case PlayerPhase.Ended: {
          player.seekToProgressTime(0);
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
  },

  mounted() {
    this.player.callbacks.on("onPhaseChanged", phase => {
      this.phase = phase;
    });

    this.player.callbacks.on("onProgressTimeChanged", currentTime => {
      this.currentTime = currentTime;
      this.showProgressTime = displayWatch(
        Math.floor(this.player.progressTime / 1000)
      );
    });
  }
};
</script>

<style lang="less">
@import "./PlayerController";
</style>