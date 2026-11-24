<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { api } from "../services/api";
import { projects as initialProjects } from "@shared/content";
import PageHeading from "../components/PageHeading.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const projects = ref(initialProjects);
onMounted(async () => {
  projects.value = await api.getProjects();
});
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main">
      <PageHeading
        title="项目"
        english="SELECTED PROJECTS"
        description="从页面结构到看图方式，记录这个个人网站里的具体实践。"
      />

      <div class="project-grid">
        <RouterLink
          v-for="(project, index) in projects"
          :key="project.slug"
          class="project-card"
          :to="`/projects/${project.slug}`"
        >
          <div class="project-card__image">
            <img :src="project.image" :alt="`${project.title}界面示意`" />
          </div>
          <div class="project-card__body">
            <p class="project-card__meta">
              {{ String(index + 1).padStart(2, "0") }} / {{ project.english }}
            </p>
            <div class="project-card__title">
              <h2>{{ project.title }}</h2>
              <ArrowUpRight :size="22" aria-hidden="true" />
            </div>
            <p class="project-card__summary">{{ project.summary }}</p>
          </div>
        </RouterLink>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.project-grid {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
}

.project-card {
  overflow: hidden;
  border-top: 2px solid var(--my-text-color);
  background: var(--my-surface-color);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px var(--my-shadow-color);
  }
}

.project-card__image {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--my-secondary-color);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 350ms ease;

    .project-card:hover & {
      transform: scale(1.025);
    }
  }
}

.project-card__body {
  padding: 1.5rem;
}

.project-card__meta {
  margin: 0 0 0.75rem;
  color: var(--my-main-color);
  font-family: var(--font-english);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
}

.project-card__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.375rem;
    font-weight: 500;
  }

  svg {
    flex: 0 0 auto;
    color: var(--my-main-color);
  }
}

.project-card__summary {
  margin: 1rem 0 0;
  color: var(--my-muted-color);
  font-size: 0.875rem;
  line-height: 1.85;
}

@media (max-width: 1023px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .project-grid {
    margin-top: 2rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
