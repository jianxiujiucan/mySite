<script setup lang="ts">
defineProps<{ note?: string }>();
</script>

<template>
  <footer class="site-footer">
    <span>© 2026 NING JING</span>
    <span>{{ note || "LESS, BUT WITH INTENT" }}</span>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  width: var(--content-wide);
  min-height: 4.625rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--my-line-color);
  color: var(--my-muted-color);
  font-family: var(--font-english);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
}

@media (max-width: 640px) {
  .site-footer {
    width: calc(100% - 12.3077vw);
    min-height: 3rem;
    font-size: 0.5rem;
    letter-spacing: 0.06em;
  }
}
</style>
