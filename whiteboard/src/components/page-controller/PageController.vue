<template>
  <div class="whiteboard-annex-box">
    <div class="whiteboard-annex-arrow-left" @click="setFirstStep()">
      <img :src="isFirst() ? firstDisabled : first" />
    </div>
    <div class="whiteboard-annex-arrow-left" @click="handlePptPreviousStep()">
      <img :src="isFirst() ? backDisabled : back" />
    </div>
    <div class="whiteboard-annex-arrow-page">{{activeIndex + 1}} / {{scenes.length}}</div>
    <div class="whiteboard-annex-arrow-right" @click="handlePptNextStep()">
      <img :src="isLast() ? nextDisabled : next" />
    </div>
    <div class="whiteboard-annex-arrow-left" @click="setLastStep()">
      <img :src="isLast() ? lastDisabled : last" />
    </div>
  </div>
</template>

<script>
import next from "./src/image/next.svg";
import last from "./src/image/last-active.svg";
import nextDisabled from "./src/image/next-disabled.svg";
import lastDisabled from "./src/image/last-disable.svg";
import back from "./src/image/back.svg";
import backDisabled from "./src/image/back-disable.svg";
import first from "./src/image/first-active.svg";
import firstDisabled from "./src/image/first-disable.svg";
export default {
  name: "PageController",
  data() {
    return {
      next,
      last,
      back,
      first,
      nextDisabled,
      lastDisabled,
      backDisabled,
      firstDisabled,
      roomState: this.room.state,
      activeIndex: this.room.state.sceneState.index,
      scenes: this.room.state.sceneState.scenes
    };
  },
  props: {
    room: {
      type: Object
    }
  },
  methods: {
    async handlePptPreviousStep() {
      this.room.pptPreviousStep();
    },

    async handlePptNextStep() {
      this.room.pptNextStep();
    },

    isFirst() {
      const activeIndex = this.roomState.sceneState.index;
      return activeIndex === 0;
    },

    isLast() {
      const activeIndex = this.roomState.sceneState.index;
      const lastIndex = this.roomState.sceneState.length - 1;
      return activeIndex === lastIndex;
    },

    setLastStep() {
      // const lastIndex = this.roomState.sceneState.scenes.length - 1;
      const lastIndex = this.roomState.sceneState.scenes.length - 1;
      this.room.setSceneIndex(lastIndex);
    },

    setFirstStep() {
      this.room.setSceneIndex(0);
    }
  },

  mounted() {
    const room = this.room;
    room.callbacks.on("onRoomStateChanged", modifyState => {
      this.roomState = { ...room.state, ...modifyState };
    });
  }

  // created() {
  //   console.log(this.room.state.scenes);
  // }
};
</script>

<style lang="less">
@import "./PageController.less";
</style>