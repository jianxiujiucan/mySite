<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main not-found">
      <p>404 / NOT FOUND</p>
      <h1>这一页还没有内容。</h1>
      <RouterLink class="primary-link" to="/">
        <ArrowLeft :size="17" aria-hidden="true" />
        返回首页
      </RouterLink>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  > p {
    color: var(--my-main-color);
    font-family: var(--font-english);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
  }
}

h1 {
  margin: 1rem 0 2.5rem;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 500;
}
</style>
