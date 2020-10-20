<template>
  <div></div>
</template>

<script>
import copy from "copy-to-clipboard";
import Identity from "@/Identity";
import inviteActive from "@/assets/image/invite-active.svg";
import invite from "@/assets/image/invite.svg";
export default {
  name: "InviteButton",
  data() {
    return {
      inviteActive,
      invite
    };
  }
};
</script>

<style lang="less">
@import "./InviteButton.less";
</style>