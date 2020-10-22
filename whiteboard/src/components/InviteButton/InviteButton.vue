<template>
  <el-popover
    trigger="click"
    placement="bottom"
    width="400"
    @click="onVisibleChange"
  >
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
            <el-button
              @click="copyUuidSuccess"
              slot="append"
              icon="el-icon-document-copy"
            ></el-button
          ></el-input>
        </div>
        <div class="invite-url-box">
          <span :style="{ whidth: '96px' }">加入链接：</span>
          <el-input :value="uuid" slot="append">
            <el-button
              @click="copyLinkSuccess"
              slot="append"
              icon="el-icon-document-copy"
            ></el-button
          ></el-input>
        </div>
      </div>
      <div class="invite-button-box">
        <el-button
          type="primary"
          size="medium"
          :style="{ width: '164px', height: '40px' }"
          @click="copySuccess"
          >复制</el-button
        >
      </div>
    </div>

    <img
      slot="reference"
      @click="handleInvite"
      :src="inviteDisable ? inviteActive : invite"
      alt="invite"
    />
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
      invite,
      inviteDisable: false,
      isLocal: location.hostname === "localhost"
    };
  },
  methods: {
    handleCopy() {
      this.handleInvite();
      copy(
        `房间号：${this.uuid}\n加入链接：https://demo.netless.link/whiteboard/${Identity.joiner}/${this.uuid}/`
      );
    },
    onVisibleChange(event) {
      if (event) {
        this.inviteDisable = true;
      } else {
        this.inviteDisable = false;
      }
    },
    handleInvite() {
      this.inviteDisable = !this.inviteDisable;
    },
    copySuccess() {
      this.$message({
        message: "已经将信息复制到剪贴板",
        type: "success",
        center: true
      });
    },
    copyUuidSuccess() {
      this.$message({
        message: "已经将 uuid 黏贴到剪贴板",
        type: "success",
        center: true
      });
    },
    copyLinkSuccess() {
      this.$message({
        message: "已经将链接黏贴到剪贴板",
        type: "success",
        center: true
      });
    }
  }
};
</script>

<style lang="less">
@import "./InviteButton.less";
</style>
