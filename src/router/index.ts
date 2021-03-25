import { createRouter, createWebHistory } from "vue-router";

import puzzle from "/@components/puzzle/puzzle.vue";
import connect from "/@components/connect/connect.vue";
import attachment from "/@components/attachment/attachment.vue";
import puzzleImg from "/@components/puzzleImg/puzzleImg.vue";

const routes = [
  {
    path: "/",
    name: "puzzle2",
    component: puzzle
  },
  {
    path: "/puzzle",
    name: "puzzle",
    component: puzzle
  },
  {
    path: "/connect",
    name: "connect",
    component: connect
  },
  {
    path: "/attachment",
    name: "attachment",
    component: attachment
  },
  {
    path: "/puzzleImg",
    name: "puzzleImg",
    component: puzzleImg
  },
];
const router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;
