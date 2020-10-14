import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/IndexPage/Index.vue";
import Join from "@/views/JoinPage/Join.vue";
// import WhiteboardCreatorPage from "@/views/WhiteboardCreatorPage/WhiteboardCreatorPage.vue";
import Whiteboard from "@/views/WhiteboardPage/Whiteboard.vue";
import Replay from "@/views/ReplayPage/Replay.vue";

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
    path: "/replay/:uuid/:userId",
    name: "Replay",
    component: Replay,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes,
});

export default router;
