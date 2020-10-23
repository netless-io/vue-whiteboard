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
                <div
                  class="menu-head-btn"
                  @click="handleClose"
                  :style="{ marginLeft: 8 }"
                >
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
                    <div class="ppt-image" ref="bindPpt"></div>
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
      sceneDir: this.room.state.sceneState.scenePath.split("/").slice(0, -1),
      hoverCellIndex: null,
      drawer: false,
      path: "",
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

    setupDivRefUntilBindPptExist() {
      if (this.$refs.bindPpt == null) {
        setTimeout(this.setupDivRefUntilBindPptExist.bind(this));
      } else {
        const bindPpt = this.$refs.bindPpt;
        const scenes = this.scenes;
        if (bindPpt && scenes) {
          if (bindPpt.length < scenes.length) {
            setTimeout(this.setupDivRefUntilBindPptExist.bind(this));
            return;
          }
          scenes.map((scene, i) => {
            if (!(i < bindPpt.length)) {
              console.warn(i, bindPpt.length);
              return;
            }
            this.path = this.sceneDir.concat(scene.name).join("/");
            try {
              // console.log(this.path, bindPpt[i]);
              this.room.scenePreview(this.path, bindPpt[i], 208, 156);
            } catch {
              console.debug("error");
            }
          });
        }
      }
    },

    setupDivRef(modifyState) {
      this.roomState = { ...this.room.state, ...modifyState };
      this.setupDivRefUntilBindPptExist();
    }
  },

  mounted() {
    this.room.callbacks.on("onRoomStateChanged", this.setupDivRef);
    this.$watch(
      "room.state.sceneState.scenes",
      this.setupDivRefUntilBindPptExist
    );
  }
};
</script>

<style lang="less">
@import "./PreviewController.less";
.hidden {
  visibility: hidden;
}
</style>