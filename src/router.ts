import { watch } from "vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuth } from "./composables/useAuth";
import Landing from "./pages/Landing.vue";
// Layouts
import DefaultLayout from "./layouts/DefaultLayout.vue";
import NoLayout from "./layouts/NoLayout.vue";
// Pages
import Dashboard from "./pages/Dashboard.vue";
import NotFound from "./pages/NotFound.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Landing", component: Landing },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: NoLayout,
    children: [{ path: "", name: "NotFound", component: NotFound }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading.value) {
    const stop = watch(loading, (val) => {
      if (!val) {
        stop();
        if (to.meta.requiresAuth && !isLoggedIn.value) {
          next("/");
        } else {
          next();
        }
      }
    });
  } else {
    if (to.meta.requiresAuth && !isLoggedIn.value) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
