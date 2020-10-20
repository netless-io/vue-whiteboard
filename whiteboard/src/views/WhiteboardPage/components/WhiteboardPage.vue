<template>
  <div class="realtime-box">
    <div class="logo-box">
      <img :src="logo" />
    </div>
    <div class="tool-box-out">
      <template v-if="roomIsInit">
        <tool-box :room="this.$room">
          <oss-upload-button
            :room="this.$room"
            :oss="ossConfigObj"
            :appIdentifier="netlessToken.appIdentifier"
            :sdkToken="netlessToken.sdkToken"
          >
          </oss-upload-button>
        </tool-box>
      </template>
    </div>
    <div class="redo-undo-box">
      <template v-if="roomIsInit">
        <redo-undo :room="this.$room"></redo-undo>
      </template>
    </div>
    <div class="zoom-controller-box">
      <template v-if="roomIsInit">
        <zoom-controller :room="this.$room"></zoom-controller>
      </template>
    </div>
    <div class="room-controller-box">
      <div class="page-controller-mid-box">
        <div class="page-controller-cell">
          <template v-if="roomIsInit">
            <exit-button-room
              :room="this.$room"
              :userId="userId"
            ></exit-button-room>
          </template>
        </div>
      </div>
    </div>
    <div class="page-controller-box">
      <div class="page-controller-mid-box">
        <el-tooltip effect="light" content="Page preview" placement="top">
          <div class="page-controller-cell">
            <template v-if="roomIsInit">
              <preview-controller :room="this.$room"></preview-controller>
            </template>
          </div>
        </el-tooltip>
        <template v-if="roomIsInit">
          <page-controller :room="this.$room" />
        </template>
      </div>
    </div>
    <div ref="bindRoom" class="whiteboard-box" />
  </div>
</template>

<script>
// import { createPlugins, Room, RoomPhase, WhiteWebSdk } from "white-web-sdk";
import Vue from "vue";
import Identity from "@/Identity";
import { videoPlugin } from "@netless/white-video-plugin";
import { audioPlugin } from "@netless/white-audio-plugin";
import { createPlugins, WhiteWebSdk } from "white-web-sdk";
import { netlessToken, ossConfigObj } from "../../../appToken"; // ossConfigObj
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
import pages from "@/assets/image/pages.svg";
import folder from "@/assets/image/folder.svg";
import logo from "@/assets/image/logo.svg";
import RedoUndo from "@/components/RedoUndo/RedoUndo";
import PageController from "@/components/page-controller/PageController";
import ZoomController from "@/components/zoom-controller/ZoomController";
import PreviewController from "@/components/preview-controller/PreviewController";
import ExitButtonRoom from "@/components/Exit/ExitButtonRoom";
import OssUploadButton from "@/components/oss-upload-button/OssUploadButton";
import ToolBox from "@/components/tool-box/ToolBox";

export default {
  name: "WhiteboardPage",
  components: {
    RedoUndo,
    PageController,
    ZoomController,
    PreviewController,
    ExitButtonRoom,
    OssUploadButton,
    ToolBox
  },

  data() {
    return {
      pages,
      folder,
      logo,
      phase: "",
      uuid: "",
      userId: "",
      roomIsInit: false,
      isMenuVisible: false,
      isFileOpen: false,
      netlessToken,
      ossConfigObj,
      identity: Identity
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

    async startJoinRoom() {
      this.uuid = this.$route.params.uuid;
      this.userId = this.$route.params.userId;
      this.identity = this.$route.params.identity;
      try {
        const roomToken = await this.getRoomToken(this.uuid);
        // if (uuid && roomToken) {
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
        const whiteWebSdk = new WhiteWebSdk({
          appIdentifier: netlessToken.appIdentifier,
          plugins: plugins
        });
        const room = await whiteWebSdk.joinRoom(
          {
            uuid: this.uuid,
            roomToken: roomToken,
            userPayload: {
              userId: this.userId
            },
            floatBar: true
          },
          {
            onPhaseChanged: phase => {
              this.phase = phase;
              console.log(`room ${this.uuid} change: ${phase}`);
            },
            onDisconnectWithError: error => {
              console.error(error);
            },
            onKickedWithReason: reason => {
              console.error("kicked with reason: " + reason);
            }
          }
        );
        // this.room = room;
        console.log(room);
        // window.room = room;
        room.setMemberState({
          pencilOptions: {
            disableBezier: false,
            sparseHump: 1.0,
            sparseWidth: 1.0,
            enableDrawPoint: false
          }
        });
        room.bindHtmlElement(this.$refs.bindRoom);
        // this.$room = room;
        this.roomIsInit = true;
        Vue.prototype.$room = room;

        console.log(this.$room);
        // }
      } catch (error) {
        console.error(error);
      }
    },

    handlePreviewState(state) {
      this.isMenuVisible = state;
    },

    handleDocCenterState(state) {
      this.isFileOpen = state;
    }

    // provide() {
    //   return {
    //     ref: this
    //   };
    // }
  },

  async mounted() {
    await this.startJoinRoom();
  },

  created() {
    Vue.prototype.$room = undefined;
  }
};
</script>

<style scoped lang="less">
@import "./WhiteboardPage.less";
</style>
