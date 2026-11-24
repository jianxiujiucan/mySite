<script setup lang="ts">
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { adminApi, errorMessage } from "../api";

const route = useRoute();
const router = useRouter();
const username = ref("admin");
const password = ref("");
const pending = ref(false);
const error = ref("");
const webUrl = import.meta.env.DEV ? "http://localhost:3002" : "/";

async function submit() {
  error.value = "";
  pending.value = true;
  try {
    await adminApi.login(username.value, password.value);
    const redirect = String(route.query.redirect || "/admin/profile");
    await router.replace(redirect.startsWith("/admin") ? redirect : "/admin/profile");
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <main id="main-content" class="admin-login">
    <section class="admin-login__card" aria-labelledby="admin-login-title">
      <a class="brand" :href="webUrl" aria-label="返回网站首页">
        <span class="brand__seal" aria-hidden="true" />
        <span>NING JING</span>
      </a>
      <div class="admin-login__icon"><LockKeyhole :size="24" aria-hidden="true" /></div>
      <p class="admin-kicker">CONTENT ADMIN</p>
      <h1 id="admin-login-title">内容管理后台</h1>
      <p class="admin-login__intro">登录后管理简介、项目、摄影和书法内容。</p>
      <form @submit.prevent="submit">
        <div class="admin-field">
          <label for="admin-username">账号</label>
          <input id="admin-username" v-model="username" autocomplete="username" required />
        </div>
        <div class="admin-field">
          <label for="admin-password">密码</label>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            autofocus
          />
        </div>
        <p v-if="error" class="admin-form-error" role="alert">{{ error }}</p>
        <button class="admin-button admin-login__submit" type="submit" :disabled="pending">
          <LoaderCircle v-if="pending" class="spin" :size="17" aria-hidden="true" />
          <ArrowRight v-else :size="17" aria-hidden="true" />
          {{ pending ? "正在登录" : "登录后台" }}
        </button>
      </form>
      <a class="admin-login__back" :href="webUrl">返回个人网站</a>
    </section>
  </main>
</template>
