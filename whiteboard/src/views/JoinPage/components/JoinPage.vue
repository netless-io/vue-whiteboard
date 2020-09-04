<template>
  <div class="page-index-box">
    <div class="page-index-mid-box">
      <div class="page-index-logo-box">
        <img :src="logo" />
        <span>0.0.1</span>
      </div>
      <div class="page-index-form-box">
        <el-input
          class="page-index-input-box"
          placeholder="请输入房间号"
          prefix-icon="el-icon-search"
          maxlength="8"
          show-word-limit
          v-model="roomId"
        ></el-input>
        <el-button
          class="page-index-btn-box"
          type="primary"
          @click="handleJoin"
          :disabled="roomId === ''"
          :value="roomId"
        >加入房间</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/image/logo.svg";
import router from "@/router";

export default {
  name: "JoinPage",
  props: {},
  data() {
    return {
      logo,
      roomId: ""
    };
  },
  methods: {
    handleJoin() {
      const userId = `${Math.floor(Math.random() * 100000)}`;
      router.push({ path: `/whiteboard/${this.roomId}/${userId}` });
      console.log(this.roomId);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./JoinPage.less";
</style>
