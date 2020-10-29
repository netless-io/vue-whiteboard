import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/IndexPage/Index.vue";
import Join from "@/views/JoinPage/Join.vue";
import Whiteboard from "@/views/WhiteboardPage/Whiteboard.vue";
import Replay from "@/views/ReplayPage/Replay.vue";
import ReplaySync from "@/views/ReplayPage/ReplaySync.vue";
// import WhiteboardCreatorPage from "@/views/WhiteboardCreatorPage/WhiteboardCreatorPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/join",
    name: "Join",
    component: Join,
  },
  // {
  //   path: "/whiteboard/:uuid",
  //   name: "WhiteboardCreatorPage",
  //   component: WhiteboardCreatorPage,
  // },
  {
    path: "/whiteboard/:identity/:uuid/:userId",
    name: "Whiteboard",
    component: Whiteboard,
  },
  {
    path: "/replay/:identity/:uuid/:userId",
    name: "Replay",
    component: Replay
  },
  {
    path: "/replaySync/:identity/:uuid/:userId",
    name: "ReplaySync",
    component: ReplaySync
  }
];

const router = new VueRouter({
  routes
});

export default router;
