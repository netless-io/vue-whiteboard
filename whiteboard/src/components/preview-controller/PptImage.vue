<template>
  <div class="ppt-image" :data-index="index"></div>
</template>

<script>
export default {
  name: "PptImage",
  props: {
    index: {
      type: Number,
      require: true
    }
  },
  mounted() {
    this.$emit("mounted", this);
  }
};
</script>
