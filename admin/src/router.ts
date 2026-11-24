import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "./api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/admin/login",
      name: "admin-login",
      component: () => import("./views/AdminLoginView.vue"),
      meta: { title: "后台登录 · 静听风声" },
    },
    {
      path: "/admin",
      component: () => import("./views/AdminLayout.vue"),
      meta: { requiresAdmin: true },
      children: [
        { path: "", redirect: "/admin/profile" },
        {
          path: "profile",
          name: "admin-profile",
          component: () => import("./views/ProfileAdmin.vue"),
          meta: { title: "简介管理 · 静听风声", requiresAdmin: true },
        },
        {
          path: "projects",
          name: "admin-projects",
          component: () => import("./views/ProjectsAdmin.vue"),
          meta: { title: "项目管理 · 静听风声", requiresAdmin: true },
        },
        {
          path: "photography",
          name: "admin-photography",
          component: () => import("./views/PhotographyAdmin.vue"),
          meta: { title: "摄影管理 · 静听风声", requiresAdmin: true },
        },
        {
          path: "calligraphy",
          name: "admin-calligraphy",
          component: () => import("./views/CalligraphyAdmin.vue"),
          meta: { title: "书法管理 · 静听风声", requiresAdmin: true },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/admin/profile" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !isAuthenticated.value) {
    return { name: "admin-login", query: { redirect: to.fullPath } };
  }
  if (to.name === "admin-login" && isAuthenticated.value) {
    return { name: "admin-profile" };
  }
});

router.afterEach((to) => {
  document.title = String(to.meta.title || "内容管理后台 · 静听风声");
});

export default router;
