<template>
  <div></div>
</template>

<script>
import router from "@/router";
import { netlessWhiteboardApi } from "../../apiMiddleware/RoomOperator";

export default {
  name: "WhiteboardCreatorPage",
  data() {
    return {
      foundError: false,
      uuid: "",
      historied: ""
    };
  },

  methods: {
    async createRoomAndGetUuid(room, limit) {
      const res = await netlessWhiteboardApi.room.createRoomApi(room, limit);
      if (res.code === 200) {
        return res.msg.room.uuid;
      } else {
        return null;
      }
    },

    handleRedirect() {
      if (this.foundError) {
        return router.push({ path: `/PageError/` });
      } else if (this.uuid && this.userId) {
        return router.push({
          path: `/whiteboard/${this.uuid}/${this.userId}/`
        });
      }
      return null;
    }
  },

  async beforeMount() {
    try {
      if (this.$route.params.uuid) {
        this.uuid = this.$route.params.uuid;
        console.log(this.uuid);
      } else {
        const uuid = await this.createRoomAndGetUuid("test", 0, this.historied);
        const userId = `${Math.floor(Math.random() * 100000)}`;
        this.userId = userId;
        if (uuid) {
          this.uuid = uuid;
        } else {
          console.log(Error);
        }
      }
    } catch (error) {
      this.foundError = true;
      throw error;
    }
  },

  mounted() {
    this.handleRedirect();
    console.log("object");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
