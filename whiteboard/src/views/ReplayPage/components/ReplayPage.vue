<template>
  <div>this is ReplayPage</div>
</template>

<script>
import polly from "polly-js";
import { netlessToken } from "../../../appToken";
import video_play from "@/assets/image/video-play.svg";
import logo from "@/assets/image/logo.svg";

export default {
  name: "ReplayPage",
  data() {
    return {
      logo,
      video_play
    };
  }
};
</script>

<style lang="less">
@import "./ReplayPage.less";
</style>