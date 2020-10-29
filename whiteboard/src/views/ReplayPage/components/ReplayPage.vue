<template>
  <div>
    <template v-if="replayFail">
      <page-error></page-error>
    </template>
    <template v-else-if="isLoading">
      <loading-page :text="loadingText"></loading-page>
    </template>
    <template v-else-if="player === undefined">
      <loading-page></loading-page>
    </template>
    <template v-else>
      <div class="player-out-box">
        <div class="logo-box">
          <img :src="logo" />
        </div>
        <div class="room-controller-box">
          <div class="page-controller-mid-box">
            <div class="page-controller-cell">
              <exit-button-player
                :identity="identity"
                :uuid="uuid"
                :userId="userId"
                :player="player"
              ></exit-button-player>
            </div>
          </div>
        </div>
        <div class="player-board">
          <template v-if="player && isVisible">
            <div @mouseenter="isVisible = true">
              <player-controller :player="player"></player-controller>
            </div>
          </template>
          <div
            class="player-board-inner"
            @mouseover="isVisible = true"
            @mouseleave="isVisible = false"
          >
            <div
              class="player-mask"
              @click.prevent="onClickOperationButton(player)"
            >
              <div
                v-if="phase === 'pause' || phase === 'waitingFirstFrame'"
                class="player-big-icon"
              >
                <img
                  :src="video_play"
                  :style="{ width: '50px', marginLeft: '6px' }"
                />
              </div>
              <div
                class="player-box"
                ref="bindRoom"
                @click="handleBindRoom"
                :style="{ backgroundColor: 'F2F2F2' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { WhiteWebSdk, createPlugins, PlayerPhase } from "white-web-sdk";
import Identity from "@/Identity";
import { videoPlugin } from "@netless/white-video-plugin";
import { audioPlugin } from "@netless/white-audio-plugin";
import polly from "polly-js";
import { netlessToken } from "../../../appToken";
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
import video_play from "@/assets/image/video-play.svg";
import logo from "@/assets/image/logo.svg";
import PlayerController from "@/components/player-controller/PlayerController";
import ExitButtonPlayer from "@/components/Exit/ExitButtonPlayer";
import LoadingPage from "@/views/LoadingPage/LoadingPage";
import PageError from "@/views/PageError/PageError";

export default {
  name: "ReplayPage",
  components: {
    ExitButtonPlayer,
    PlayerController,
    LoadingPage,
    PageError
  },
  data() {
    return {
      logo,
      video_play,
      currentTime: 0,
      phase: PlayerPhase.WaitingFirstFrame,
      isPlayerSeeking: false,
      isVisible: false,
      replayFail: false,
      replayState: false,
      uuid: "",
      userId: "",
      player: "",
      identity: Identity,
      isLoading: true,
      loadingText: "正在生成回放，请耐心等待"
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
      // TODO   add cursorTool
      // const cursorAdapter = new CursorTool();

      const player = await whiteWebSdk.replayRoom(
        // , cursorAdapter: cursorAdapter
        { room: uuid, roomToken: roomToken },
        {
          onPhaseChanged: phase => {
            this.phase = phase;
          },
          onStoppedWithError: error => {
            console.error(`Playback error: ${error}`);
            // message.error(`Playback error: ${error}`); //TODO add elementUI
            this.replayFail = true;
          },
          onProgressTimeChanged: scheduleTime => {
            this.currentTime = scheduleTime;
          }
        }
      );
      // cursorAdapter.setPlayer(player);
      this.player = player;
      this.isLoading = false;
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
      switch (player.phase) {
        case PlayerPhase.WaitingFirstFrame: {
          this.$refs.bindRoom.click();
          player.play();
          break;
        }
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
    this.uuid = this.$route.params.uuid;
    this.identity = this.$route.params.identity;
    this.userId = this.$route.params.userId;
    const plugins = createPlugins({
      video: videoPlugin,
      audio: audioPlugin
    });
    plugins.setPluginContext("video", {
      identity: this.identity === Identity.creator ? "host" : ""
    });
    plugins.setPluginContext("audio", {
      identity: this.identity === Identity.creator ? "host" : ""
    });
    const roomToken = await this.getRoomToken(this.uuid);
    if (this.uuid && roomToken) {
      const whiteWebSdk = new WhiteWebSdk({
        appIdentifier: netlessToken.appIdentifier
      });

      await this.loadPlayer(whiteWebSdk, this.uuid, roomToken);
    }
    window.addEventListener(
      "keydown",
      event => {
        if (event.keyCode === 32) {
          this.onClickOperationButton(this.player);
        }
      },
      false
    );
  }
};
</script>

<style lang="less">
@import "./ReplayPage.less";
</style>
