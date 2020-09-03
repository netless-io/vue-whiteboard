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
            <router-link to="/whiteboard">
              <img :src="create" />
            </router-link>
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

export default {
  name: "IndexPage",
  props: {},
  data() {
    return {
      logo,
      join,
      create
    };
  }
};
</script>

<style scoped lang="less">
@import "./IndexPage.less";
</style>
