<template>
  <div>
    <img :src="pages" @click="handleOpen" />
    <el-drawer
      :modal="false"
      :show-close="true"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="handleClose"
      :wrapperClosable="true"
      :modal-append-to-body="false"
      custom-class="drawer-class"
    >
      <div :style="{ width: 240 }">
        <div class="menu-annex-box">
          <div class="menu-title-line-box">
            <div class="menu-title-line">
              <div class="menu-title-text-box">Previwe</div>
              <div class="menu-title-left">
                <div class="menu-head-btn" @click="handleAddPage">
                  <img :src="addPage" />
                </div>
                <div class="menu-head-btn" @click="handleClose">
                  <img :src="close" />
                </div>
              </div>
            </div>
          </div>
          <div :style="{ height: 64 }"></div>
          <div class="menu-annex-body">
            <div class="preview-cells-box">
              <template v-for="(item, index) in scenes">
                <div class="page-out-box" :key="item.index">
                  <div class="page-box" @click="setScenePath(index)">
                    <ppt-image
                      :index="index"
                      @mounted="setupDivRefOnMounted"
                    ></ppt-image>
                  </div>
                  <div class="page-box-under">
                    <div class="page-box-under-left">{{ index + 1 }}</div>
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
import close from "./src/image/close.svg";
import addPage from "./src/image/add-page.svg";
import deleteIcon from "./src/image/delete.svg";
import pages from "./src/image/pages.svg";
import PptImage from "./PptImage.vue";

export default {
  name: "PreviewController",
  props: {
    room: {
      type: Object,
      require: true
    }
  },
  components: {
    PptImage
  },
  data() {
    return {
      close,
      addPage,
      deleteIcon,
      pages,
      isFocus: false,
      roomState: this.room.state,
      sceneDir: this.room.state.sceneState.scenePath.split("/").slice(0, -1),
      hoverCellIndex: null,
      drawer: false,
      activeIndex: "",
      scenePath: ""
    };
  },

  computed: {
    scenes() {
      return this.room.state.sceneState.scenes;
    }
  },

  methods: {
    handleOpen() {
      this.drawer = true;
    },

    handleClose() {
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

    handleAddPage() {
      this.activeIndex = this.roomState.sceneState.index;
      const newSceneIndex = this.activeIndex + 1;
      this.scenePath = this.roomState.sceneState.scenePath;
      const pathName = this.pathName(this.scenePath);
      this.room.putScenes(pathName, [{}], newSceneIndex);
      this.room.setSceneIndex(newSceneIndex);
      this.room.setSceneIndex(newSceneIndex);
    },

    onRoomStateChanged(modifyState = {}) {
      console.log("hello");
      this.roomState = { ...this.room.state, ...modifyState };
      const images = Array.from(document.querySelectorAll(".ppt-image"));
      this.scenes?.forEach((scene, index) => {
        if (!(index < images.length)) return;
        this.setupDivRef(images[index], scene);
      });
    },

    setupDivRef(el, scene) {
      const path = this.sceneDir.concat(scene.name).join("/");
      this.room.scenePreview(path, el, 208, 156);
    },

    setupDivRefOnMounted(pptImage) {
      const index = pptImage.index;
      if (!this.scenes || !(index < this.scenes.length)) return;
      this.setupDivRef(pptImage.$el, this.scenes[index]);
    }
  },

  mounted() {
    this.room.callbacks.on("onRoomStateChanged", this.onRoomStateChanged);
    document.body.addEventListener("mouseup", this.onRoomStateChanged);
  }
};
</script>

<style lang="less">
@import "./PreviewController.less";
.hidden {
  visibility: hidden;
}
</style>
