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
                <!-- 添加 preview 页面的按钮 -->
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
              <!-- 渲染元素 ，每点击一次“添加”按钮，在控制台可以看到 scenes 未能及时更新数据，重刷页面后才更新-->
              <template v-for="(item, index) in scenes">
                <div class="page-out-box" :key="item.index">
                  <div class="page-box" @click="setScenePath(index)">
                    <div class="ppt-image" ref="bindPpt"></div>
                  </div>
                  <div class="page-box-under">
                    <div class="page-box-under-left"></div>
                    <div class="page-box-under-right" @click="removeScene">
                      <img :src="deleteIcon" />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import Vue from "vue";
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
      activeIndex: '',
      scenePath: '',
      oncevis: false
    };
  },

  methods: {
    // 暂时魔改的 elementUI 可忽略
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
    // 暂时魔改的 elementUI 可忽略
    test(done) {
      console.log(12, this.drawer, done);
      this.drawer = false;
    },

    removeScene() {
      this.scenePath = this.roomState.sceneState.scenePath;
      this.room.removeScenes(`${this.scenePath}`);
    },

    setScenePath(newActiveIndex) {
      this.room.setSceneIndex(newActiveIndex);
    },

    pathName(path) {
        const cells = path.split("/");
        const popCell = cells.pop();
        if (popCell === "") {
            cells.pop();
        }
        return cells.join("/");
    },
    // 添加页面
    handleAddPage() {
      console.log('sceneState.index',this.roomState.sceneState.index)
      this.activeIndex = this.roomState.sceneState.index;
      const newSceneIndex = this.activeIndex + 1;
      this.scenePath = this.roomState.sceneState.scenePath;
      const pathName = this.pathName(this.scenePath);
      // Vue.set(this.data ,this.scenes, scenesValue);
      this.room.setSceneIndex(newSceneIndex);
      console.log('object',this.room.putScenes);
      this.room.putScenes(pathName, [{}], newSceneIndex);
      console.log('secenes', this.scenes);
      // this.$forceUpdate();
    },

    // 在这个方法中传递 ref 后，被提示非dom元素。如果去掉template中的 v-for 属性，那么报错消失。
    setupDivRef(ref) {
      if (ref) {
        console.log('ref1', typeof(ref))
        console.log('refs', this.$refs.bindPpt)
        this.path = this.sceneDir.concat(this.scenes.name).join("/")
        this.room.scenePreview(this.path, ref, 208, 156);
      }
    }
  },

  mounted() {
    // 暂时魔改的 elementUI 可忽略
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

    // 在此处调用 setupDivRef ，因为只有在$nextTick中才能获取到 $refs
    this.$nextTick(() => {
      console.warn("refs", this.$refs.bindPpt);
      this.setupDivRef(this.$refs.bindPpt);
    });
  },
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