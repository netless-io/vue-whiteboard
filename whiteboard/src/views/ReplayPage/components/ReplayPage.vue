<template>
  <div class="player-out-box">
    <div class="logo-box">
      <img :src="logo" />
    </div>
    <div class="room-controller-box">
      <div class="page-controller-mid-box">
        <!-- ExitButtonPlayer -->
      </div>
    </div>
    <div class="player-board">
      <template v-if="player && isVisible">
        <div @mouseenter="isVisible = true">
          <!-- <player-controller></player-controller> -->
        </div>
      </template>
      <div class="player-board-inner" @mouseover="isVisible = true" @mouseleave="isVisible = false">
        <div class="player-mask" @click="onClickOperationButton(player)">
          <template v-if="phase === Pause">
            <div class="player-big-icon">
              <!-- 还未添加样式 -->
              <img :src="video_play" :style="{width: 50, marginLeft: 6}" />
            </div>
          </template>
          <div class="player-box" ref="bindRoom" @click="handleBindRoom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { WhiteWebSdk, PlayerPhase, Player } from "white-web-sdk";
import { WhiteWebSdk } from "white-web-sdk";
// import { WaitingFirstFrame, Playing, Pause, Ended } from "../../../PlayerPhase";
import PlayerPhase from "../../../PlayerPhase";
import polly from "polly-js";
import { netlessToken } from "../../../appToken";
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
import video_play from "@/assets/image/video-play.svg";
import logo from "@/assets/image/logo.svg";
// import PlayerController from "@/components/player-controller/PlayerController";

export default {
  name: "ReplayPage",
  components: {
    // PlayerController
  },
  data() {
    return {
      logo,
      video_play,
      currentTime: 0,
      phase: "",
      isPlayerSeeking: false,
      isVisible: false,
      replayFail: false,
      replayState: false,
      Pause: "",
      Playing: "",
      Ended: "",
      // WhiteWebSdk: WhiteWebSdk,
      player: ""
    };
  },
  methods: {
    async getRoomToken(uuid) {
      const res = await netlessWhiteboardApi.room.joinRoomApi(uuid);
      if (res.code === 200) {
        return res.msg.roomToken;
      } else {
        return null;
      }
    },

    async loadPlayer(whiteWebSdk, uuid, roomToken) {
      await polly()
        .waitAndRetry(10)
        .executeForPromise(async () => {
          const whiteWebSdk = new WhiteWebSdk({
            appIdentifier: netlessToken.appIdentifier
          });
          const replayState = await whiteWebSdk.isPlayable({ room: uuid });
          if (replayState) {
            this.replayState = true;
            await this.startPlayer(whiteWebSdk, uuid, roomToken);
            return Promise.resolve();
          } else {
            this.replayState = false;
            return Promise.reject();
          }
        });
    },

    onWindowResize() {
      if (this.player) {
        this.player.refreshViewSize();
      }
    },

    async startPlayer(whiteWebSdk, uuid, roomToken) {
      // cursorTool 工具还未开发
      // const cursorAdapter = new CursorTool();

      const player = await whiteWebSdk.replayRoom(
        // , cursorAdapter: cursorAdapter
        { room: uuid, roomToken: roomToken },
        {
          onPhaseChanged(phase) {
            this.phase = phase;
          },
          // onLoadFirstFrame() {
          //   cursorAdapter.setPlayer(player);
          // },
          onStoppedWithError(error) {
            console.error(`Playback error: ${error}`);
            // message.error(`Playback error: ${error}`); //后续添加 element 组件
            this.replayFail = true;
          },
          onProgressTimeChanged(scheduleTime) {
            this.currentTime = scheduleTime;
          }
        }
      );
      // cursorAdapter.setPlayer(player);
      this.player = player;
      console.log("player", this.player);
    },

    handleBindRoom() {
      if (this.player) {
        this.player.bindHtmlElement(this.$refs.bindRoom);
      }
    },

    handleSpaceKey() {
      if (this.player) {
        this.onClickOperationButton(this.player);
      }
    },

    onClickOperationButton(player) {
      switch (this.player.phase) {
        case PlayerPhase.WaitingFirstFrame:
        case PlayerPhase.Pause: {
          player.play();
          break;
        }
        case PlayerPhase.Playing: {
          player.pause();
          break;
        }
        case PlayerPhase.Ended: {
          player.seekToScheduleTime(0);
          break;
        }
      }
    }
  },

  async mounted() {
    // window.addEventListener("keydown", this.handleSpaceKey);
    this.$on("keydown", function() {
      this.handleSpaceKey;
    });

    // 后续添加 identity 参数
    const uuid = this.$route.params.uuid;
    console.log("uuid", uuid);
    const roomToken = await this.getRoomToken(uuid);
    console.log("roomToken", roomToken);
    if (uuid && roomToken) {
      const whiteWebSdk = new WhiteWebSdk({
        appIdentifier: netlessToken.appIdentifier
      });
      console.log("whiteWebSdk", whiteWebSdk);
      await this.loadPlayer(whiteWebSdk, uuid, roomToken);
      console.log("this.player", this.player);
    }
  }
};
</script>

<style lang="less">
@import "./ReplayPage.less";
</style>