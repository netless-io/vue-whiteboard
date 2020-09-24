<template>
  <div class="page-index-box">
    <div class="page-index-mid-box">
      <div class="page-index-logo-box">
        <img :src="logo" />
        <span>0.0.1</span>
        <div class="page-index-start-box">
          <div class="page-index-start-cell">
            <router-link to="/join">
              <img :src="join" />
            </router-link>
            <span>加入房间</span>
          </div>
          <div class="page-index-cutline-box"></div>
          <div class="page-index-start-cell">
            <!-- <router-link to="/whiteboard/:uuid/:userId"> -->
            <img :src="create" @click="handleJump" />
            <!-- </router-link> -->
            <span>创建房间</span>
          </div>
        </div>
        <div class="page-index-start-term">
          使用产品即代表同意
          <span>《软件许可以及服务协议》</span>和
          <span>《隐私协议》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/image/logo.svg";
import join from "@/assets/image/join.svg";
import create from "@/assets/image/create.svg";
import { netlessWhiteboardApi } from "../../../apiMiddleware/RoomOperator";
export default {
  name: "IndexPage",
  props: {},
  data() {
    return {
      logo,
      join,
      create,
      uuid: "",
      userId: ""
    };
  },
  methods: {
    async createRoomAndGetUuid(room, limit, mode) {
      const res = await netlessWhiteboardApi.room.createRoomApi(
        room,
        limit,
        mode
      );
      if (res.code == 200) {
        this.uuid = res.msg.room.uuid;
      }
      this.userId = `${Math.floor(Math.random() * 100000)}`;
    },

    handleJump() {
      this.$router.push({ path: `/whiteboard/${this.uuid}/${this.userId}` });
    }
  },
  mounted() {
    this.createRoomAndGetUuid();
  }
};
</script>

<style scoped lang="less">
@import "./IndexPage.less";
</style>
