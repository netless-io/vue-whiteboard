<template>
  <div>
    <el-tooltip placement="bottom" content="Exit" effect="light">
      <div class="page-controller-cell">
        <img :src="exit" @click="dialogVisible = true" />
      </div>
    </el-tooltip>
    <el-dialog
      title="退出回放"
      :visible.sync="dialogVisible"
      width="25%"
      center
      :modal-append-to-body="false"
    >
      <div class="modal-box">
        <div @click="handleReplay">
          <img class="modal-box-img" :src="replayScreen" />
        </div>
        <div class="modal-box-name">回到白板</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :style="{ width: '176px' }" @click="handleGoBack"
          >确认退出</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import exit from "@/assets/image/exit.svg";
import replayScreen from "@/assets/image/replay-screen.png";
export default {
  name: "ExitButtonPlayer",
  data() {
    return {
      exit,
      replayScreen,
      dialogVisible: false,
      exitViewDisable: false
    };
  },
  props: {
    room: {
      type: Object,
      require: true
    },
    userId: {
      require: true
    },
    identity: {
      type: String
    }
  },
  methods: {
    handleReplay() {
      this.$router.push(
        `/whiteboard/${this.identity}/${this.uuid}/${this.userId}/`
      );
      console.log("click");
    },

    handleGoBack() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="less">
@import "./ExitButton.less";
</style>
