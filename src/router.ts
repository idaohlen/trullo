import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Dashboard from "./pages/Dashboard.vue";
import Landing from "./pages/Landing.vue";
import { useAuth } from "./composables/useAuth";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useAuth();
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next("/");
  } else {
    next();
  }
});

export default router;
