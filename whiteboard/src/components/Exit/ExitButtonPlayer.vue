<template>
  <el-popopver trigger="click" placement="right-end">
    <div class="page-controller-cell">
      <div class="invite-box">
        <div class="invite-box-title">
          邀请加入
        </div>
        <div
          :style="{
            width: '400px',
            height: '0.5px',
            backgroundColor: '#E7E7E7'
          }"
        ></div>
        <div class="invite-text-box">
          <div class="invite-url-box">
            <span :style="{ whidth: '96px' }">房间号:</span>
            <!-- input component -->
          </div>
        </div>
      </div>
      <img :src="this.inviteDisable ? inviteActive : invite" alt="invite" />
    </div>
  </el-popopver>
</template>

<script>
export default {
  name: "ExitButtonPlayer"
};
</script>

<style lang="less">
@import "./ExitButton.less";
</style>