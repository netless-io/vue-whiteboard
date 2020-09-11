<template>
  <div class="realtime-box">
    <div class="logo-box">
      <img :src="logo" />
    </div>
    <div class="tool-box-out"></div>
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
        <div class="page-controller-cell"></div>
      </div>
    </div>
    <div class="page-controller-box">
      <div class="page-controller-mid-box">
        <el-tooltip effect="light" content="Page preview" placement="top">
          <div class="page-controller-cell" @click="handlePreviewState(true)">
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

    <!-- <template v-if="roomIsInit">
      <preview-controller
        :room="this.$room"
        :handlePreviewState="handlePreviewState"
        :isVisible="isMenuVisible"
      ></preview-controller>
    </template>-->
    <div ref="bindRoom" class="whiteboard-box" />
  </div>
</template>

<script>
// import { createPlugins, Room, RoomPhase, WhiteWebSdk } from "white-web-sdk";
import Vue from "vue";
import { WhiteWebSdk } from "white-web-sdk";
import { netlessToken } from "../../../appToken";
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
import pages from "@/assets/image/pages.svg";
import folder from "@/assets/image/folder.svg";
import logo from "@/assets/image/logo.svg";
import RedoUndo from "@/components/RedoUndo/RedoUndo";
import PageController from "@/components/page-controller/PageController";
import ZoomController from "@/components/zoom-controller/ZoomController";
import PreviewController from "@/components/preview-controller/PreviewController";
export default {
  name: "WhiteboardPage",
  components: {
    RedoUndo,
    PageController,
    ZoomController,
    PreviewController
  },
  // props: {
  //   isMenuVisible: Boolean,
  //   isFileOpen: Boolean
  // },
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
      isFileOpen: false
      // drawer: false
      // whiteboardLayerDownRef
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

    handleRoom() {},

    // handleBindRoom(ref) {
    //   // const { room } = this;
    //   this.whiteboardLayerDownRef = ref;
    //   if (room) {
    //     room.bindHtmlElement(ref);
    //   }
    // },

    async startJoinRoom() {
      this.uuid = this.$route.params.uuid;
      this.userId = this.$route.params.userId;
      console.log(this.uuid);
      console.log(this.userId);
      try {
        const roomToken = await this.getRoomToken(this.uuid);
        // if (uuid && roomToken) {
        const whiteWebSdk = new WhiteWebSdk({
          appIdentifier: netlessToken.appIdentifier
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
        // console.log(this.room);
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

        // this.room = room;
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
