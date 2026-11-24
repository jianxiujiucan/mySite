<script setup lang="ts">
import { ArrowLeft, Expand } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "../services/api";
import type { PhotoAlbum } from "@shared/types";
import ImageLightbox from "../components/ImageLightbox.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const route = useRoute();
const album = ref<PhotoAlbum | null>(null);
const selected = ref<number | null>(null);
const lightboxImages = computed(() => album.value?.photos || []);

async function load() {
  selected.value = null;
  album.value = await api.getAlbum(String(route.params.slug));
}

onMounted(load);
watch(() => route.params.slug, load);
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main">
      <template v-if="album">
        <div class="album-heading">
          <div>
            <p>{{ album.subtitle }}</p>
            <h1>{{ album.title }}</h1>
            <p v-if="album.description" class="album-heading__detail">
              {{ album.description }}
            </p>
          </div>
          <RouterLink to="/photography">
            <ArrowLeft :size="16" aria-hidden="true" />
            全部相册
          </RouterLink>
        </div>

        <div class="photo-grid">
          <button
            v-for="(photo, index) in album.photos"
            :key="photo.id"
            class="photo-item"
            type="button"
            :aria-label="`放大图片：${photo.title}`"
            @click="selected = index"
          >
            <span class="photo-item__image">
              <img :src="photo.src" :alt="photo.alt" loading="lazy" />
              <Expand :size="20" aria-hidden="true" />
            </span>
            <span class="photo-item__title">{{ photo.title }}</span>
          </button>
        </div>
      </template>
      <div v-else class="album-empty">
        <h1>没有找到这个相册</h1>
        <RouterLink class="primary-link" to="/photography"
          >返回摄影栏目</RouterLink
        >
      </div>
    </main>
    <SiteFooter note="PHOTOGRAPHY / ALBUM" />
    <ImageLightbox v-model="selected" :images="lightboxImages" />
  </div>
</template>

<style scoped lang="scss">
.album-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1.5rem;
  border-top: 2px solid var(--my-text-color);

  p {
    margin: 0 0 0.75rem;
    color: var(--my-main-color);
    font-size: 0.75rem;
    letter-spacing: 0.12em;
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 3.5rem;
    font-weight: 500;
  }

  a {
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--my-muted-color);
    font-size: 0.875rem;

    &:hover {
      color: var(--my-main-color);
    }
  }
}

.album-heading .album-heading__detail {
  max-width: 42rem;
  margin-top: 1rem;
  color: var(--my-muted-color);
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 1.8;
}

.photo-grid {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem 1.5rem;
}

.photo-item {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--my-text-color);
  text-align: left;
  cursor: zoom-in;
}

.photo-item__image {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--my-secondary-color);

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
    color: var(--my-text-color);
    opacity: 0;
    transition: opacity 180ms ease;
  }

  .photo-item:hover & img {
    transform: scale(1.025);
  }

  .photo-item:hover & svg,
  .photo-item:focus-visible & svg {
    opacity: 1;
  }
}

.photo-item__title {
  display: block;
  padding-top: 0.75rem;
  font-size: 0.875rem;
}

.album-empty {
  min-height: 55vh;
  display: grid;
  place-content: center;
  justify-items: start;
  gap: 2rem;
}

@media (max-width: 640px) {
  .album-heading {
    h1 {
      font-size: 2rem;
    }

    a {
      font-size: 0.75rem;
    }
  }

  .photo-grid {
    margin-top: 2rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 0.75rem;
  }

  .photo-item__image svg {
    display: none;
  }
}
</style>
