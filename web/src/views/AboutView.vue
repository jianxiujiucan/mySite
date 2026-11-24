<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../services/api";
import { profile as initialProfile } from "@shared/content";
import SiteHeader from "../components/SiteHeader.vue";
import SiteFooter from "../components/SiteFooter.vue";

const profile = ref(initialProfile);
onMounted(async () => {
  profile.value = await api.getProfile();
});
</script>

<template>
  <div class="page-shell">
    <SiteHeader inner />
    <main id="main-content" class="page-main about">
      <div class="about__copy">
        <p class="about__eyebrow">ABOUT / PROFILE</p>
        <h1>我是{{ profile.name }}。</h1>
        <p
          v-for="paragraph in profile.introduction"
          :key="paragraph"
          class="about__paragraph"
        >
          {{ paragraph }}
        </p>
        <RouterLink class="primary-link" to="/projects">看看我的项目</RouterLink>
      </div>
      <div class="about__portrait">
        <span class="about__frame" aria-hidden="true" />
        <img :src="profile.avatar" :alt="`${profile.name}的插画头像`" />
        <p>WORK · LIFE · CREATION</p>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.about {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
  align-items: center;
  gap: 8rem;
}

.about__copy {
  max-width: 39rem;
}

.about__eyebrow {
  margin: 0 0 1.25rem;
  color: var(--my-main-color);
  font-family: var(--font-english);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0 0 2.5rem;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.about__paragraph {
  margin: 0 0 1.25rem;
  color: var(--my-muted-color);
  font-size: 1rem;
  line-height: 2;
}

.primary-link {
  margin-top: 1.25rem;
}

.about__portrait {
  position: relative;
  padding: 3rem;
  text-align: center;

  img {
    position: relative;
    width: min(100%, 20rem);
    display: block;
    margin: auto;
    border-radius: 50%;
    background: var(--my-surface-color);
  }

  p {
    margin: 2rem 0 0;
    color: var(--my-muted-color);
    font-family: var(--font-english);
    font-size: 0.625rem;
    letter-spacing: 0.16em;
  }
}

.about__frame {
  position: absolute;
  inset: 0;
  border: 1px solid var(--my-line-color);

  &::before {
    content: "";
    position: absolute;
    top: -0.375rem;
    right: -0.375rem;
    width: 0.75rem;
    height: 0.75rem;
    background: var(--my-main-color);
  }
}

@media (max-width: 1023px) {
  .about {
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .about {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  h1 {
    margin-bottom: 1.5rem;
    font-size: 2.25rem;
  }

  .about__paragraph {
    font-size: 0.9375rem;
    line-height: 1.9;
  }

  .about__portrait {
    width: 100%;
    padding: 2rem;
  }
}
</style>
