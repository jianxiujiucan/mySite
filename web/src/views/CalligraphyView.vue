<script setup lang="ts">
import { Expand } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { api } from "../services/api";
import { calligraphyWorks as initialWorks } from "@shared/content";
import ImageLightbox from "../components/ImageLightbox.vue";
import PageHeading from "../components/PageHeading.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const works = ref(initialWorks);
const selected = ref<number | null>(null);
const lightboxImages = computed(() =>
  works.value.map((work, index) => ({
    id: index,
    src: work.src,
    alt: work.alt,
    title: work.title,
    description: work.description,
  }))
);

onMounted(async () => {
  works.value = await api.getCalligraphy();
});
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main">
      <PageHeading
        title="书法"
        english="CALLIGRAPHY WALL"
        description="保留纸张的原本比例。点击一张字稿，放大后可以继续翻看。"
      />

      <div class="calligraphy-wall">
        <button
          v-for="(work, index) in works"
          :key="work.slug"
          class="work"
          type="button"
          :aria-label="`放大书法作品：${work.title}`"
          @click="selected = index"
        >
          <span class="work__image" :style="{ aspectRatio: work.ratio }">
            <img
              :src="work.src"
              :alt="work.alt"
              loading="lazy"
              decoding="async"
            />
            <Expand :size="20" aria-hidden="true" />
          </span>
          <span class="work__title">
            {{ work.title }}
            <span>{{ String(index + 1).padStart(2, "0") }}</span>
          </span>
        </button>
      </div>
    </main>
    <SiteFooter note="CALLIGRAPHY / PRACTICE" />
    <ImageLightbox v-model="selected" :images="lightboxImages" />
  </div>
</template>

<style scoped lang="scss">
.calligraphy-wall {
  margin-top: 3.5rem;
  columns: 3;
  column-gap: 1.5rem;
}

.work {
  width: 100%;
  margin: 0 0 1.5rem;
  padding: 0;
  display: inline-block;
  break-inside: avoid;
  border: 0;
  background: transparent;
  color: var(--my-text-color);
  text-align: left;
  cursor: zoom-in;
}

.work__image {
  position: relative;
  display: block;
  overflow: hidden;
  border-top: 2px solid var(--my-text-color);
  background: var(--my-surface-color);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 300ms ease;
  }

  svg {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    padding: 0.375rem;
    box-sizing: content-box;
    background: var(--my-surface-color);
    opacity: 0;
    transition: opacity 180ms ease;
  }

  .work:hover & img {
    transform: scale(1.025);
  }

  .work:hover & svg,
  .work:focus-visible & svg {
    opacity: 1;
  }
}

.work__title {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  font-family: var(--font-display);
  font-size: 1rem;

  > span {
    color: var(--my-main-color);
    font-family: var(--font-english);
    font-size: 0.625rem;
  }
}

@media (max-width: 640px) {
  .calligraphy-wall {
    margin-top: 2rem;
    columns: 2;
    column-gap: 0.75rem;
  }

  .work {
    margin-bottom: 1rem;
  }

  .work__title {
    font-size: 0.875rem;
  }

  .work__image svg {
    display: none;
  }
}
</style>
