<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

defineProps<{ inner?: boolean }>();
</script>

<template>
  <header class="site-header" :class="{ 'site-header--inner': inner }">
    <RouterLink class="brand" to="/" aria-label="静听风声首页">
      <span class="brand__seal" aria-hidden="true" />
      <span>NING JING</span>
    </RouterLink>
    <RouterLink v-if="inner" class="back-link" to="/">
      <ArrowLeft :size="16" aria-hidden="true" />
      返回首页
    </RouterLink>
    <span v-else class="site-header__edition">PERSONAL COLLECTION / 2026</span>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  width: var(--content-wide);
  min-height: 5rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--my-line-color);
  font-family: var(--font-english);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 2.75rem;
  color: var(--my-text-color);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.brand__seal {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 2px;
  background: var(--my-main-color);
}

.site-header__edition {
  color: var(--my-muted-color);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.15em;
}

.back-link {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--my-muted-color);
  font-size: 0.8125rem;

  &:hover {
    color: var(--my-main-color);
  }
}

@media (max-width: 640px) {
  .site-header {
    width: calc(100% - 12.3077vw);
    min-height: 4rem;
  }

  .brand {
    font-size: 0.625rem;
    gap: 0.625rem;
  }

  .site-header__edition {
    font-size: 0.5rem;
    letter-spacing: 0.08em;
  }
}
</style>
