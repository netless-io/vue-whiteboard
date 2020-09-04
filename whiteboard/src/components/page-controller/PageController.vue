<template>
  <div></div>
</template>

<script>
import next from "./src/image/next-disabled.svg";
import last from "./src/image/last.svg";
import nextDisabled from "./src/image/next-disabled.svg";
import lastDisabled from "./src/image/last-disabled.svg";
export default {
  name: "PageController",
  data() {
    return {
      next,
      last,
      nextDisabled,
      lastDisabled
    };
  },
  props: ["room"],
  methods: {
    handlePptPreviousStep() {}
  }
};
</script>

<style lang="less">
@import "./PageController.less";
</style>