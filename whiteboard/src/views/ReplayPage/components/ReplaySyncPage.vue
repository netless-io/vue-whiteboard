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
      <div class="overall-box">
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
            <template v-if="player && combinePlayer && isVisible">
              <div @mouseenter="isVisible = true">
                <player-sync-controller
                  :player="player"
                  :combine-player="combinePlayer"
                ></player-sync-controller>
              </div>
            </template>
            <div
              class="player-board-inner"
              @mouseover="isVisible = true"
              @mouseleave="isVisible = false"
            >
              <div
                class="player-mask"
                @click="onClickOperationButton(combinePlayer)"
              >
                <div v-if="phase === 'pause'" class="player-big-icon">
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
        <video
          class="video-box video-js"
          ref="videoDOM"
          width="500"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { createPlugins, PlayerPhase, WhiteWebSdk } from "white-web-sdk";
import Identity from "@/Identity";
import { videoPlugin } from "@netless/white-video-plugin";
import { audioPlugin } from "@netless/white-audio-plugin";
import polly from "polly-js";
import { netlessToken } from "@/appToken";
import { netlessWhiteboardApi } from "@/apiMiddleware/RoomOperator";
import video_play from "@/assets/image/video-play.svg";
import logo from "@/assets/image/logo.svg";
import PlayerSyncController from "@/components/player-controller/PlayerSyncController";
import ExitButtonPlayer from "@/components/Exit/ExitButtonPlayer";
import LoadingPage from "@/views/LoadingPage/LoadingPage";
import PageError from "@/views/PageError/PageError";
import CombinePlayerFactory from "@netless/combine-player";

export default {
  name: "ReplaySyncPage",
  components: {
    ExitButtonPlayer,
    PlayerSyncController,
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
      loadingText: "正在生成回放，请耐心等待",
      combinePlayer: null
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
      const replayState = await polly()
        .waitAndRetry(10)
        .executeForPromise(async () => {
          return await whiteWebSdk.isPlayable({
            region: "cn-hz",
            room: uuid,
            roomToken
          });
        });

      if (replayState) {
        this.replayState = true;
        await this.startPlayer(whiteWebSdk, uuid, roomToken);
      }
    },

    onWindowResize() {
      if (this.player) {
        this.player.refreshViewSize();
      }
    },

    async startPlayer(whiteWebSdk, uuid, roomToken) {
      // TODO   add cursorTool
      // const cursorAdapter = new CursorTool();

      // cursorAdapter.setPlayer(player);
      this.player = await whiteWebSdk.replayRoom(
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
      this.isLoading = false;

      this.$nextTick(() => {
        const combinePlayerFactory = new CombinePlayerFactory(
          this.player,
          {
            url:
              "https://docs-assets.oss-cn-hangzhou.aliyuncs.com/m3u8-video/test.m3u8",
            videoDOM: this.$refs.videoDOM
          },
          true
        );

        const combinePlayer = combinePlayerFactory.create();
        combinePlayer.setOnStatusChange((status, message) => {
          console.log("状态发生改变: ", status, message);
        });

        this.combinePlayer = combinePlayer;
      });
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

    onClickOperationButton(combinePlayer) {
      switch (this.player.phase) {
        case PlayerPhase.WaitingFirstFrame:
        case PlayerPhase.Pause:
        case PlayerPhase.Ended: {
          combinePlayer.play();
          break;
        }
        case PlayerPhase.Playing: {
          combinePlayer.pause();
          break;
        }
      }
    }
  },

  async mounted() {
    this.uuid = this.$route.params.uuid;
    console.log("uuid", this.uuid);
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

    //  TODO keydown
    // window.addEventListener(
    //   "keydown",
    //   event => {
    //     if (event.keyCode === 32) {
    //       console.warn("test", this.player);
    //       this.onClickOperationButton(this.player);
    //     }
    //     console.log("clicked", event.keyCode);
    //   },
    //   false
    // );
  }
};
</script>

<style lang="less">
@import "./ReplayPage.less";
@import "./ReplaySyncPage.less";
@import "https://cdn.bootcdn.net/ajax/libs/video.js/7.10.1/alt/video-js-cdn.css";
</style>
