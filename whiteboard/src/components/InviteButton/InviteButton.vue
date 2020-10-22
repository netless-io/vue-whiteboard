<template>
  <el-popover trigger="click" placement="bottom" width="400">
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
        <div class="invite-url-box" :style="{ marginBottom: '12px' }">
          <span :style="{ whidth: '96px', paddingRight: '14px' }"
            >房间号：</span
          >
          <el-input :value="uuid" slot="append">
            <el-button slot="append" icon="el-icon-document-copy"></el-button
          ></el-input>
        </div>
        <div class="invite-url-box">
          <span :style="{ whidth: '96px' }">加入链接：</span>
          <el-input :value="uuid" slot="append">
            <el-button slot="append" icon="el-icon-document-copy"></el-button
          ></el-input>
        </div>
      </div>
      <div class="invite-button-box">
        <el-button
          type="primary"
          size="medium"
          :style="{ width: '164px', height: '40px' }"
          >复制</el-button
        >
      </div>
    </div>

    <img slot="reference" :src="invite" alt="invite" />
  </el-popover>
</template>

<script>
import copy from "copy-to-clipboard";
import Identity from "@/Identity";
import inviteActive from "@/assets/image/invite-active.svg";
import invite from "@/assets/image/invite.svg";
export default {
  name: "InviteButton",
  props: {
    uuid: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      inviteActive,
      invite
    };
  },
  methods: {
    handleCopy() {
      copy(
        `房间号：${this.uuid}\n加入链接：https://demo.netless.link/whiteboard/${Identity.joiner}/${this.uuid}/`
      );
      // message
    }
  }
};
</script>

<style lang="less">
@import "./InviteButton.less";
</style>
