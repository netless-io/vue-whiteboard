<template>
  <div class="page404-image-box">
    <div class="page404-image-box">
      <img
        :src="room_not_find"
        alt="room_not_find"
        class="page404-image-inner"
      />
      <div class="page404-inner">
        <div class="page404-inner-title">抱歉，您要访问的页面不存在</div>
        <div class="page404-inner-script">
          可能是链接地址有误，页面已经被移除或者隐藏
        </div>
        <router-link to="/">
          <el-button size="medium" :style="{ width: '118px' }"
            >返回首页</el-button
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import room_not_find from "@/assets/image/room_not_find.svg";
export default {
  name: "PageError",
  data() {
    return {
      room_not_find
    };
  }
};
</script>

<style lang="less">
@import "./PageError.less";
</style>
