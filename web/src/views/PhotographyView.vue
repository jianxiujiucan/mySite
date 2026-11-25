<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { api } from "../services/api";
import { albums as initialAlbums } from "@shared/content";
import PageHeading from "../components/PageHeading.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const albums = ref(initialAlbums);
onMounted(async () => {
  albums.value = await api.getAlbums();
});
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main">
      <PageHeading
        title="摄影"
        english="PHOTO ALBUMS"
        description="按主题收好照片。点击一组缩略图，进入相册逐张翻看。"
      />

      <div class="album-grid">
        <RouterLink
          v-for="album in albums"
          :key="album.slug"
          class="album-card"
          :to="`/photography/${album.slug}`"
          :aria-label="`打开相册：${album.title}`"
        >
          <div class="album-card__thumbnails">
            <img
              v-for="photo in album.photos.slice(0, 4)"
              :key="photo.id"
              :src="photo.thumbnailSrc || photo.src"
              :alt="photo.alt"
              loading="lazy"
              decoding="async"
              width="640"
              height="640"
            />
          </div>
          <div class="album-card__body">
            <div>
              <h2>{{ album.title }}</h2>
              <p>{{ album.subtitle }}</p>
            </div>
            <div class="album-card__action">
              <span>{{ album.photos.length }} 张</span>
              <ArrowUpRight :size="22" aria-hidden="true" />
            </div>
          </div>
        </RouterLink>
      </div>
    </main>
    <SiteFooter note="PHOTOGRAPHY / ALBUMS" />
  </div>
</template>

<style scoped lang="scss">
.album-grid {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
}

.album-card {
  padding: 1.25rem;
  border-top: 2px solid var(--my-text-color);
  background: var(--my-surface-color);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px var(--my-shadow-color);
  }
}

.album-card__thumbnails {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.375rem;
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 1;
    display: block;
    object-fit: cover;
    transition: transform 300ms ease;
  }

  .album-card:hover & img {
    transform: scale(1.025);
  }
}

.album-card__body {
  margin-top: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
}

p {
  margin: 0.375rem 0 0;
  color: var(--my-muted-color);
  font-size: 0.8125rem;
}

.album-card__action {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: var(--my-main-color);

  span {
    white-space: nowrap;
    color: var(--my-muted-color);
    font-size: 0.75rem;
  }
}

@media (max-width: 1023px) {
  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .album-grid {
    margin-top: 2rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .album-card {
    padding: 1rem;
  }
}
</style>
