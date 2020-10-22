<template>
  <div class="player-schedule">
    <div class="player-mid-box">
      <seek-slider
        :fullTime="this.player.timeDuration"
        :currentTime="getCurrentTime(this.currentTime)"
        :hideHoverTime="true"
        @onChange="handleChangeTime"
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
            <div v-if="phase === 'pause'">
              <img :src="video_play" :style="{ marginLeft: '2px' }" />
            </div>
            <div v-else-if="phase === 'playing'">
              <img :src="video_pause" />
            </div>
            <div v-else>
              <img :src="video_play" />
            </div>
          </div>
          <div class="player-mid-box-time">
            {{ showProgressTime }} / {{ showTime }}
          </div>
        </div>
        <el-dropdown placement="top-start" @command="handleActiveMultiple">
          <span class="el-dropdown-link">{{
            multiple === 1.0 ? "倍数" : `${multiple}x`
          }}</span>
          <el-dropdown-menu slot="dropdown" class="player-menu-box">
            <!-- <template v-for="item in multipleArr">
              <el-dropdown-item :key="item.values" slot="dropdown" class="player-menu-box"></el-dropdown-item>
            </template> -->
            <el-dropdown-item
              :style="{ color: multiple === 2.0 ? '#ff0000' : null }"
              command="2.0"
              >2.0x</el-dropdown-item
            >
            <el-dropdown-item
              :style="{ color: multiple === 1.5 ? '#ff0000 !important' : null }"
              command="1.5"
              >1.5x</el-dropdown-item
            >
            <el-dropdown-item
              :style="{
                color: multiple === 1.25 ? '#ff0000 !important' : null
              }"
              command="1.25"
              >1.25x</el-dropdown-item
            >
            <el-dropdown-item
              :style="{ color: multiple === 1.0 ? '#ff0000 !important' : null }"
              command="1.0"
              >1.0x</el-dropdown-item
            >
            <el-dropdown-item
              :style="{
                color: multiple === 0.75 ? '#ff0000 !important' : null
              }"
              command="0.75"
              >0.75x</el-dropdown-item
            >
            <el-dropdown-item
              :style="{ color: multiple === 0.5 ? '#ff0000 !important' : null }"
              command="0.5"
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
import { displayWatch } from "./WatchDisplay";

export default {
  name: "PlayerController",
  components: {
    SeekSlider
  },
  props: {
    player: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      video_play,
      video_pause,
      progressTime: 0,
      phase: PlayerPhase.WaitingFirstFrame,
      // changePhase: "playing",
      // phase: this.player.phase,
      isPlayerSeeking: false,
      currentTime: 0,
      multiple: Number(this.player.playbackSpeed),
      showTime: displayWatch(Math.floor(this.player.timeDuration / 1000)),
      showProgressTime: displayWatch(
        Math.floor(this.player.progressTime / 1000)
      )
    };
  },

  methods: {
    handleChangeTime(time) {
      if (this.player) {
        this.currentTime = time;
        this.player.seekToProgressTime(time);
      }
    },

    onClickOperationButton(player) {
      switch (this.player.phase) {
        case PlayerPhase.WaitingFirstFrame:
        case PlayerPhase.Pause: {
          // this.changePhase = "pause";
          player.play();
          break;
        }
        case PlayerPhase.Playing: {
          player.pause();
          break;
        }
        case PlayerPhase.Ended: {
          player.seekToProgressTime(0);
          break;
        }
      }
      console.log("video object");
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

    handleMultiplePlay(command) {
      this.player.playbackSpeed = command;
    },

    handleActiveMultiple(command) {
      this.handleMultiplePlay(command);
      this.multiple = Number(command);
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
