<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import SiteFooter from "../components/SiteFooter.vue";
import SiteHeader from "../components/SiteHeader.vue";

const cards = [
  {
    title: "简介",
    english: "ABOUT",
    image: "/images/home/about.svg",
    route: "/about",
    ground: "var(--my-about-ground)",
  },
  {
    title: "项目",
    english: "PROJECTS",
    image: "/images/home/projects.svg",
    route: "/projects",
    ground: "var(--my-projects-ground)",
  },
  {
    title: "摄影",
    english: "PHOTOGRAPHY",
    image: "/images/home/photography.svg",
    route: "/photography",
    ground: "var(--my-photography-ground)",
  },
  {
    title: "书法",
    english: "CALLIGRAPHY",
    image: "/images/home/calligraphy.svg",
    route: "/calligraphy",
    ground: "var(--my-calligraphy-ground)",
  },
];
</script>

<template>
  <div class="home">
    <SiteHeader />
    <main id="main-content" class="home__main">
      <section class="home__hero" aria-labelledby="home-title">
        <div class="home__identity" data-enter>
          <div class="home__avatar">
            <img src="/images/home/avatar.svg" alt="静听风声的插画头像" />
            <span aria-hidden="true" />
          </div>
          <h1 id="home-title">静听风声</h1>
        </div>

        <nav class="home__cards" aria-label="个人栏目">
          <RouterLink
            v-for="(card, index) in cards"
            :key="card.route"
            class="home-card"
            :to="card.route"
            :aria-label="`查看${card.title}`"
          >
            <div
              class="home-card__art"
              :style="{ backgroundColor: card.ground }"
            >
              <img :src="card.image" :alt="`${card.title}主题插画`" />
            </div>
            <span class="home-card__index">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <h2>{{ card.title }}</h2>
            <p>{{ card.english }}</p>
            <ArrowUpRight
              class="home-card__arrow"
              :size="26"
              aria-hidden="true"
            />
          </RouterLink>
        </nav>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.home {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.home__main {
  flex: 1;
}

.home__hero {
  padding: 1.5625rem 0 3.75rem;
}

.home__identity {
  text-align: center;
  animation: home-enter 600ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
}

.home__avatar {
  position: relative;
  width: 9.25rem;
  height: 9.25rem;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--my-surface-color);

  img {
    width: 8.375rem;
    height: 8.375rem;
    margin: 0.4375rem;
    display: block;
  }

  span {
    position: absolute;
    top: 0.75rem;
    right: -0.0625rem;
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    background: var(--my-main-color);
  }
}

h1 {
  margin: 1.25rem 0 0;
  font-family: var(--font-display);
  font-size: 2.875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  line-height: 1.5;
}

.home__cards {
  width: min(70rem, calc(100% - 6rem));
  margin: 4.125rem auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.5rem;
}

.home-card {
  position: relative;
  height: 20rem;
  overflow: hidden;
  border-radius: 4px;
  background: var(--my-surface-color);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 2px;
    background: var(--my-text-color);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px var(--my-shadow-color);
  }

  &:active {
    transform: translateY(0);
  }
}

.home-card__art {
  height: 10.875rem;
  margin: 1rem 1rem 0;
  overflow: hidden;
  border-radius: 3px;

  img {
    width: 100%;
    height: 100%;
    padding: 0.5rem 0.75rem;
    display: block;
    object-fit: contain;
    transition: transform 350ms ease;
  }

  .home-card:hover & img {
    transform: scale(1.03);
  }
}

.home-card__index {
  display: block;
  margin: 0.625rem 1.25rem 0;
  color: var(--my-main-color);
  font-family: var(--font-english);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.home-card h2 {
  margin: 0.375rem 1.25rem 0;
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.5;
}

.home-card p {
  margin: 0.5rem 1.25rem 0;
  color: var(--my-muted-color);
  font-family: var(--font-english);
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 0.13em;
}

.home-card__arrow {
  position: absolute;
  top: 13.8125rem;
  right: 1.25rem;
  color: var(--my-main-color);
  transition: transform 180ms ease;

  .home-card:hover & {
    transform: translate(2px, -2px);
  }
}

@keyframes home-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .home__cards {
    width: min(35rem, calc(100% - 6rem));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .home__hero {
    padding: 5.1282vw 0 8.2051vw;
  }

  .home__avatar {
    width: 6.625rem;
    height: 6.625rem;

    img {
      width: 5.875rem;
      height: 5.875rem;
      margin: 0.375rem;
    }

    span {
      width: 0.625rem;
      height: 0.625rem;
      top: 0.5625rem;
      right: 0;
    }
  }

  h1 {
    margin-top: 0.5rem;
    font-size: 1.75rem;
    letter-spacing: 0.12em;
  }

  .home__cards {
    width: calc(100% - 12.3077vw);
    margin-top: 5.641vw;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4.1026vw;
  }

  .home-card {
    height: clamp(13.125rem, 56.4103vw, 17rem);
  }

  .home-card__art {
    height: clamp(5.625rem, 28.2051vw, 8.5rem);
    margin: 2.5641vw 2.5641vw 0;

    img {
      padding: 0.375rem;
    }
  }

  .home-card__index {
    margin: 0.25rem 0.875rem 0;
    font-size: 0.5rem;
  }

  .home-card h2 {
    margin: 0.125rem 0.875rem 0;
    font-size: 1.25rem;
  }

  .home-card p {
    margin: 0.25rem 0.875rem 0;
    font-size: 0.4375rem;
  }

  .home-card__arrow {
    top: auto;
    right: 0.875rem;
    bottom: 2.75rem;
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__identity {
    opacity: 1;
    transform: none;
  }
}
</style>
