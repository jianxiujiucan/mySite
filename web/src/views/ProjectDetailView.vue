<script setup lang="ts">
import { ArrowLeft, ArrowRight, Check } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "../services/api";
import type { Project } from "@shared/types";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const route = useRoute();
const project = ref<Project | null>(null);

async function load() {
  project.value = await api.getProject(String(route.params.slug));
}

onMounted(load);
watch(() => route.params.slug, load);
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main">
      <div v-if="project" class="project-detail">
        <div class="project-detail__visual">
          <img :src="project.image" :alt="`${project.title}界面示意`" />
        </div>
        <div class="project-detail__content">
          <p class="project-detail__english">{{ project.english }}</p>
          <h1>{{ project.title }}</h1>
          <p class="project-detail__description">{{ project.description }}</p>
          <ul>
            <li v-for="feature in project.features" :key="feature">
              <Check :size="17" aria-hidden="true" />
              {{ feature }}
            </li>
          </ul>
          <RouterLink class="primary-link" :to="project.relatedRoute">
            {{ project.relatedLabel }}
            <ArrowRight :size="17" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
      <div v-else class="not-found-inline">
        <h1>没有找到这个项目</h1>
        <RouterLink class="primary-link" to="/projects">
          <ArrowLeft :size="17" aria-hidden="true" />
          返回项目列表
        </RouterLink>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.project-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(20rem, 0.8fr);
  align-items: center;
  gap: 5rem;
}

.project-detail__visual {
  border-top: 2px solid var(--my-text-color);
  background: var(--my-surface-color);

  img {
    width: 100%;
    display: block;
  }
}

.project-detail__english {
  margin: 0 0 1rem;
  color: var(--my-main-color);
  font-family: var(--font-english);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 500;
  line-height: 1.35;
}

.project-detail__description {
  margin: 1.75rem 0;
  color: var(--my-muted-color);
  font-size: 1rem;
  line-height: 1.95;
}

ul {
  margin: 0 0 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--my-line-color);
  border-bottom: 1px solid var(--my-line-color);
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.25rem;
  font-size: 0.875rem;

  svg {
    color: var(--my-main-color);
  }
}

.not-found-inline {
  min-height: 55vh;
  display: grid;
  place-content: center;
  justify-items: start;
  gap: 2rem;
}

@media (max-width: 640px) {
  .project-detail {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h1 {
    font-size: 2.125rem;
  }

  .project-detail__description {
    font-size: 0.9375rem;
  }
}
</style>
