<script setup lang="ts">
defineProps<{
  title: string;
  english: string;
  description?: string;
}>();
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="page-heading__english">{{ english }}</p>
      <h1>{{ title }}</h1>
    </div>
    <p v-if="description" class="page-heading__description">
      {{ description }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--my-text-color);
}

.page-heading__english {
  margin: 0 0 0.75rem;
  color: var(--my-main-color);
  font-family: var(--font-english);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.2;
}

.page-heading__description {
  max-width: 28rem;
  margin: 0 0 0.5rem;
  color: var(--my-muted-color);
  font-size: 0.9375rem;
  line-height: 1.8;
}

@media (max-width: 640px) {
  .page-heading {
    display: block;
    padding-top: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .page-heading__description {
    margin-top: 1rem;
    font-size: 0.875rem;
  }
}
</style>
