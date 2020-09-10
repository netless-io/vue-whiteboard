<template>
  <!-- <div class="page-out-box">
    <div class="page-box"></div>
    <div class="page-box-under">
      <div class="page-box-under-left"></div>
      <div class="page-box-under-right">
        <img :src="deleteIcon" />
      </div>
    </div>
  </div>-->
  <div>
    <img :src="pages" @click="drawer = true" />
    <el-drawer
      title="我是标题"
      :modal="false"
      :show-close="true"
      :visible.sync="drawer"
      :with-header="false"
      :wrapperClosable="true"
      :modal-append-to-body="false"
    >
      <div class="menu-annex-box">
        <div class="menu-title-line-box">
          <div class="menu-title-line">
            <div class="menu-title-text-box">Previwe</div>
            <div class="menu-title-left">
              <div class="menu-head-btn">
                <img :src="addPage" />
              </div>
              <div class="menu-head-btn">
                <img :src="close" />
              </div>
            </div>
          </div>
        </div>
        <div :style="{ height: 64 }"></div>
        <div class="menu-annex-body">
          <div class="preview-cells-box">
            <div class="page-out-box">
              <div class="page-box">
                <div class="ppt-image"></div>
              </div>
              <div class="page-box-under">
                <div class="page-box-under-left"></div>
                <div class="page-box-under-right">
                  <img :src="deleteIcon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import close from "./src/image/close.svg";
import addPage from "./src/image/add-page.svg";
import deleteIcon from "./src/image/delete.svg";
import pages from "./src/image/pages.svg";

export default {
  name: "PreviewController",
  props: {
    room: {
      type: Object,
      require: true
    },
    handlePreviewState: {
      type: Function
    },
    isVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      close,
      addPage,
      deleteIcon,
      pages,
      isFocus: false,
      roomState: this.room.state,
      hoverCellIndex: null,
      drawer: false
    };
  },

  methods: {
    removeScene() {
      const scenePath = this.roomState.sceneState.scenePath;
      this.room.removeScene(`${scenePath}`);
    },

    setScenePath(newActiveIndex) {
      this.room.setSceneIndex(newActiveIndex);
    }

    // pathName(path) {
    //   const reg = /\/([^\/]*)\//g;
    //   reg.exec(path);
    //   if (RegExp.$1 === "aria") {
    //     return "";
    //   } else {
    //     return RegExp.$1;
    //   }
    // }
  },

  mounted() {
    this.room.callbacks.on("onRoomStateChanged", modifyState => {
      this.roomState = { ...this.room.state, ...modifyState };
    });
  }
};
</script>

<style lang="less">
@import "./PreviewController.less";
</style>