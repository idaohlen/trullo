import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Dashboard from "./pages/Dashboard.vue";
import Landing from "./pages/Landing.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  // Add more routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
