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
    <img :src="pages" @click="test2" />
    <el-drawer
      title="我是标题"
      :modal="false"
      :class="['normal-drawer', oncevis?'':'hidden']"
      :show-close="true"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="test"
      :wrapperClosable="true"
      :modal-append-to-body="false"
      custom-class="drawer-class"
    >
      <div :style="{width: 240}">
        <div class="menu-annex-box">
          <div class="menu-title-line-box">
            <div class="menu-title-line">
              <div class="menu-title-text-box">Previwe</div>
              <div class="menu-title-left">
                <div class="menu-head-btn" @click="handleAddPage">
                  <img :src="addPage" />
                </div>
                <div class="menu-head-btn" :style="{ marginLeft: 8 }">
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
                  <!-- @click="this.setScenePath(index)" -->
                  <div class="ppt-image" ref="bindPpt"></div>
                </div>
                <div></div>
                <div class="page-box-under">
                  <div class="page-box-under-left"></div>
                  <div class="page-box-under-right" @click="removeScene">
                    <img :src="deleteIcon" />
                  </div>
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
      scenes: this.room.state.sceneState.scenes,
      sceneDir: this.room.state.sceneState.scenePath.split("/"),
      hoverCellIndex: null,
      drawer: true,
      path: '',
      oncevis: false
    };
  },

  methods: {
    test2() {
      if (this.oncevis) this.drawer = !this.drawer;
      else {
        document
          .querySelector(".normal-drawer .el-drawer__container")
          .classList.remove("hidden");
        this.oncevis = true;
        document
          .querySelector(".normal-drawer .el-drawer__container")
          .classList.add("el-drawer__open");
      }

      console.log("c2", this.drawer, this.oncevis);
    },
    test(done) {
      console.log(12, this.drawer, done);
      this.drawer = false;
    },
    removeScene() {
      const scenePath = this.roomState.sceneState.scenePath;
      this.room.removeScene(`${scenePath}`);
    },

    setScenePath(newActiveIndex) {
      this.room.setSceneIndex(newActiveIndex);
    },

    pathName(path) {
      const reg = /\/([^\/]*)\//g;
      reg.exec(path);
      if (RegExp.$1 === "aria") {
        return "";
      } else {
        return RegExp.$1;
      }
    },

    handleAddPage() {
      const activeIndex = this.roomState.sceneState.index;
      newSceneIndex = activeIndex + 1;
      scenePath = this.roomState.sceneState.scenePath;
      pathName = this.pathName(scenePath);
      this.room.putScenes(`/${pathName}`, [{}], newSceneIndex);
      this.room.setSceneIndex(newSceneIndex);
    },

    setupDivRef(ref) {
      if (ref) {
        this.path = this.sceneDir.concat(this.scenes.name).join("/")
        this.room.scenePreview(this.path, ref, 208, 156);
      }
    }
  },

  mounted() {
    document
      .querySelector(".normal-drawer .el-drawer__container")
      .classList.remove("el-drawer__open");
    
    this.room.callbacks.on("onRoomStateChanged", modifyState => {
      this.roomState = { ...this.room.state, ...modifyState };
    });
    // setInterval(() => {
    //   this.drawer = !this.drawer;
    // }, 3000);
    // this.setupDivRef(this.$refs.bindPpt);
    // console.log(this.$refs.bindPpt);
    this.$nextTick(() => {
      console.warn("refs", this.$refs.bindPpt);
      this.setupDivRef(this.$refs.bindPpt);
    });

  }
};
</script>

<style lang="less">
@import "./PreviewController.less";
.hidden {
  visibility: hidden;
}
// .drawer-class {
//   transform: translate3d(100%, 0, 0);
// }

// .normal-drawer {
//   .drawer-class {
//     // background: cadetblue;
//     animation: rtl-drawer-in 0.3s 1ms !important;
//   }
// }
// .outside-drawer {
//   .drawer-class {
//     // transform: translate3d(100%, 0, 0);
//     // background: cadetblue;
//     animation: rtl-drawer-out 0.3s !important;
//   }
// }
// @keyframes bao {
// }
// .el-drawer__open .el-drawer.rtl {
//   animation: bao 0s !important;
// }
</style>