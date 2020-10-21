<template>
  <div class="white-board-loading">
    <div class="white-board-loading-mid">
      <img :src="loading" alt="loading" />
      <div class="text-style">{{ text }}</div>
    </div>
  </div>
</template>

<script>
import loading from "@/assets/image/loading.svg";
export default {
  name: "LoadingPage",
  props: {
    text: {
      type: String
    }
  },
  data() {
    return {
      loading
    };
  }
};
</script>

<style lang="less">
@import "./LoadingPage.less";
</style>
