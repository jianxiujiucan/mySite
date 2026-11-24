import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { title: "静听风声 · 个人主页" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { title: "简介 · 静听风声" },
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("../views/ProjectsView.vue"),
      meta: { title: "项目 · 静听风声" },
    },
    {
      path: "/projects/:slug",
      name: "project-detail",
      component: () => import("../views/ProjectDetailView.vue"),
      meta: { title: "项目详情 · 静听风声" },
    },
    {
      path: "/photography",
      name: "photography",
      component: () => import("../views/PhotographyView.vue"),
      meta: { title: "摄影 · 静听风声" },
    },
    {
      path: "/photography/:slug",
      name: "photo-album",
      component: () => import("../views/PhotoAlbumView.vue"),
      meta: { title: "相册 · 静听风声" },
    },
    {
      path: "/calligraphy",
      name: "calligraphy",
      component: () => import("../views/CalligraphyView.vue"),
      meta: { title: "书法 · 静听风声" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: { title: "页面未找到 · 静听风声" },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
  document.title = String(to.meta.title || "静听风声");
});

export default router;
