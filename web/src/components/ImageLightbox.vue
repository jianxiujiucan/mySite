<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from "lucide-vue-next";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { Photo } from "@shared/types";

const props = defineProps<{
  images: Photo[];
  modelValue: number | null;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const dialog = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;

const current = computed(() =>
  props.modelValue === null ? null : props.images[props.modelValue],
);

function close() {
  emit("update:modelValue", null);
}

function show(offset: number) {
  if (props.modelValue === null || !props.images.length) return;
  const next =
    (props.modelValue + offset + props.images.length) % props.images.length;
  emit("update:modelValue", next);
}

function onKeydown(event: KeyboardEvent) {
  if (props.modelValue === null) return;
  if (event.key === "Escape") close();
  if (event.key === "ArrowLeft") show(-1);
  if (event.key === "ArrowRight") show(1);
  if (event.key === "Tab" && dialog.value) {
    const controls = Array.from(
      dialog.value.querySelectorAll<HTMLButtonElement>("button"),
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}

watch(
  () => props.modelValue,
  async (value, previous) => {
    if (value !== null && previous === null) {
      previousFocus = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeydown);
      await nextTick();
      closeButton.value?.focus();
    } else if (value === null) {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown);
      previousFocus?.focus();
    }
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="current"
        ref="dialog"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`${current.title}，图片 ${Number(modelValue) + 1} / ${images.length}`"
        @click.self="close"
      >
        <div class="lightbox__topbar">
          <p>
            <span>{{ current.title }}</span>
            <span v-if="current.description" class="lightbox__description">
              {{ current.description }}
            </span>
            <span>{{ Number(modelValue) + 1 }} / {{ images.length }}</span>
          </p>
          <button
            ref="closeButton"
            class="lightbox__button"
            type="button"
            aria-label="关闭图片"
            @click="close"
          >
            <X :size="24" aria-hidden="true" />
          </button>
        </div>

        <button
          class="lightbox__button lightbox__button--previous"
          type="button"
          aria-label="上一张图片"
          @click="show(-1)"
        >
          <ChevronLeft :size="30" aria-hidden="true" />
        </button>

        <img class="lightbox__image" :src="current.src" :alt="current.alt" />

        <button
          class="lightbox__button lightbox__button--next"
          type="button"
          aria-label="下一张图片"
          @click="show(1)"
        >
          <ChevronRight :size="30" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 5rem 6rem;
  background: var(--my-overlay-color);
}

.lightbox__topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 4.5rem;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--my-surface-color);

  p {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 0;
    font-size: 0.875rem;
  }

  p span + span {
    color: var(--my-line-color);
    font-family: var(--font-english);
  }

  .lightbox__description {
    max-width: 42rem;
    font-family: var(--font-body);
    line-height: 1.7;
  }
}

.lightbox__image {
  display: block;
  max-width: 100%;
  max-height: calc(100svh - 10rem);
  object-fit: contain;
}

.lightbox__button {
  width: 3rem;
  height: 3rem;
  display: inline-grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--my-overlay-button);
  color: var(--my-surface-color);
  cursor: pointer;

  &:hover {
    background: var(--my-main-color);
  }
}

.lightbox__button--previous,
.lightbox__button--next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox__button--previous {
  left: 1.5rem;
}

.lightbox__button--next {
  right: 1.5rem;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 180ms ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .lightbox {
    padding: 5rem 4vw;
  }

  .lightbox__button--previous,
  .lightbox__button--next {
    top: auto;
    bottom: 1.5rem;
    transform: none;
  }
}
</style>
