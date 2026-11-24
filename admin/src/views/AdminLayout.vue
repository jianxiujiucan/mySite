<script setup lang="ts">
import {
  Camera,
  ExternalLink,
  FileText,
  FolderKanban,
  LogOut,
  PenTool,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { adminApi } from "../api";

const router = useRouter();
const webUrl = import.meta.env.DEV ? "http://localhost:3002" : "/";
const navigation = [
  { to: "/admin/profile", label: "简介管理", icon: FileText },
  { to: "/admin/projects", label: "项目管理", icon: FolderKanban },
  { to: "/admin/photography", label: "摄影管理", icon: Camera },
  { to: "/admin/calligraphy", label: "书法管理", icon: PenTool },
];

async function logout() {
  await adminApi.logout();
  await router.replace("/admin/login");
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-topbar">
      <RouterLink class="brand" to="/admin/profile">
        <span class="brand__seal" aria-hidden="true" />
        <span>NING JING</span>
        <span class="admin-topbar__label">内容管理</span>
      </RouterLink>
      <div class="admin-topbar__actions">
        <a :href="webUrl" target="_blank" rel="noopener">
          <ExternalLink :size="15" aria-hidden="true" />
          查看网站
        </a>
        <button type="button" @click="logout">
          <LogOut :size="15" aria-hidden="true" />
          退出登录
        </button>
      </div>
    </header>
    <div class="admin-workspace">
      <aside class="admin-sidebar">
        <p class="admin-kicker">CONTENT</p>
        <nav aria-label="后台内容栏目">
          <RouterLink v-for="item in navigation" :key="item.to" :to="item.to">
            <component :is="item.icon" :size="18" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>
      <main id="main-content" class="admin-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>
