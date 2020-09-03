<template>
  <div class="index-box">
    <index-page></index-page>
  </div>
</template>

<script>
// @ is an alias to /src
import IndexPage from "@/views/IndexPage/components/IndexPage.vue";

export default {
  name: "Index",
  components: {
    IndexPage,
  },
};
</script>

<style lang="less"></style>
