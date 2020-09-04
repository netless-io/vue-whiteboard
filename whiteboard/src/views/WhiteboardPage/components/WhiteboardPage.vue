<template>
  <div class="realtime-box">
    <div class="logo-box">
      <img :src="logo" />
    </div>
    <div class="tool-box-out"></div>
    <div class="redo-undo-box">
      <!-- <redo-undo :room="room"></redo-undo> -->
    </div>
    <div class="zoom-controller-box"></div>
    <div class="room-controller-box">
      <div class="page-controller-mid-box">
        <div class="page-controller-cell"></div>
      </div>
    </div>
    <div class="page-controller-box">
      <div class="page-controller-mid-box">
        <div class="page-controller-cell"></div>
      </div>
    </div>
    <div ref="bindRoom" class="whiteboard-box" />
  </div>
</template>

<script>
// import { createPlugins, Room, RoomPhase, WhiteWebSdk } from "white-web-sdk";
import { WhiteWebSdk } from "white-web-sdk";
import { netlessToken } from "../../../appToken";
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
import pages from "@/assets/image/pages.svg";
import folder from "@/assets/image/folder.svg";
import logo from "@/assets/image/logo.svg";
// import RedoUndo from "@/components/RedoUndo/RedoUndo";

export default {
  name: "WhiteboardPage",
  components: {
    // RedoUndo
  },
  props: {
    // uuid: null,
    // userId: null,
    phase: null,
    isMenuVisible: Boolean,
    isFileOpen: Boolean
  },
  data() {
    return {
      pages,
      folder,
      logo,
      room: "",
      uuid: "",
      userId: ""
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
              // console.log(`room ${uuid} change: ${phase}`);
            },
            onDisconnectWithError: error => {
              console.error(error);
            },
            onKickedWithReason: reason => {
              console.error("kicked with reason: " + reason);
            }
          }
        );
        room.setMemberState({
          pencilOptions: {
            disableBezier: false,
            sparseHump: 1.0,
            sparseWidth: 1.0,
            enableDrawPoint: false
          }
        });
        room.bindHtmlElement(this.$refs.bindRoom);
        this.$room = room;
        // }
      } catch (error) {
        console.error(error);
      }
    },

    handlePreviewState: state => {
      this.isMenuVisible = state;
    },

    handleDocCenterState: state => {
      this.isFileOpen = state;
    }
  },

  async mounted() {
    await this.startJoinRoom();
  }
};
</script>

<style scoped lang="less">
@import "./WhiteboardPage.less";
</style>
