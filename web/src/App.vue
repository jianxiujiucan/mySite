<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
