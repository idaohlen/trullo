import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import Landing from "./pages/Landing.vue";
// Layouts
import DefaultLayout from "./layouts/DefaultLayout.vue";
import NoLayout from "./layouts/NoLayout.vue";
// Pages
import Dashboard from "./pages/Dashboard.vue";
import NotFound from "./pages/NotFound.vue";
import MyProfile from "./pages/MyProfile.vue";

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
      {
        path: "my-profile",
        name: "MyProfile",
        component: MyProfile,
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

router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const client = useApolloClient().client;
    try {
      const { data } = await client.query({
        query: gql`query Me { me { id } }`,
        fetchPolicy: "network-only"
      });
      if (data.me) {
        next();
      } else {
        next("/");
      }
    } catch {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
