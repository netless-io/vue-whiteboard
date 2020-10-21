<template>
  <div>
    <el-tooltip placement="bottom" content="Exit" effect="light">
      <div class="page-controller-cell">
        <img :src="exit" @click="dialogVisible = true" />
      </div>
    </el-tooltip>
    <el-dialog
      title="退出教室"
      :visible.sync="dialogVisible"
      width="25%"
      center
      :modal-append-to-body="false"
    >
      <div class="modal-box">
        <div @click="handleReplay">
          <img class="modal-box-img" :src="replayScreen" />
        </div>
        <div class="modal-box-name">观看回放</div>
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
  name: "ExitButtonRoom",
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
  data() {
    return {
      exit,
      replayScreen,
      dialogVisible: false,
      exitViewDisable: false
    };
  },

  methods: {
    async handleReplay() {
      if (this.room) {
        await this.room.disconnect();
        this.$router.push(
          `/replay/${this.identity}/${this.room.uuid}/${this.userId}/`
        );
      }
    },

    async handleGoBack() {
      await this.room.disconnect();
      this.$router.push("/");
    },

    handleClose(done) {
      done();
    }
  }
};
</script>

<style lang="less">
@import "./ExitButton.less";
</style>