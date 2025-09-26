import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
// Layouts
import DefaultLayout from "./layouts/DefaultLayout.vue";
import NoLayout from "./layouts/NoLayout.vue";
// Pages
import Landing from "./pages/Landing.vue";
import Dashboard from "./pages/Dashboard.vue";
import NotFound from "./pages/NotFound.vue";
import MyProfile from "./pages/MyProfile.vue";
import Admin from "./pages/Admin.vue";
import ProjectDetail from "./pages/ProjectDetail.vue";

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
      {
        path: "admin",
        name: "Admin",
        component: Admin,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "projects/:id",
        name: "ProjectDetail",
        component: ProjectDetail,
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
        query: gql`
          query Me {
            me {
              id
              name
              email
              role
            }
          }
        `,
        fetchPolicy: "network-only",
      });

      // Check user data
      if (!data.me) {
        next("/");
        return;
      }

      // Check if admin role is required
      if (to.meta.requiresAdmin && data.me.role !== "ADMIN") {
        next("/"); // Redirect to home if not admin
        return;
      }
      
      next(); // Allow access

    } catch {
      next("/"); // Authentication failed
    }
  } else {
    next(); // No auth required
  }
});

export default router;
