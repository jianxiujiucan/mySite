<script setup lang="ts">
import { LoaderCircle, Save } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import type { Profile } from "@shared/types";
import ImageField from "../components/ImageField.vue";
import { adminApi, adminRequest, errorMessage } from "../api";

const form = ref<Profile>({
  name: "",
  englishName: "",
  avatar: "",
  introduction: [],
});
const introduction = ref("");
const loading = ref(true);
const saving = ref(false);
const message = ref("");
const error = ref("");

onMounted(async () => {
  try {
    const content = await adminApi.getContent();
    form.value = structuredClone(content.profile);
    introduction.value = content.profile.introduction.join("\n\n");
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    loading.value = false;
  }
});

async function save() {
  saving.value = true;
  message.value = "";
  error.value = "";
  try {
    const paragraphs = introduction.value
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    await adminRequest("/profile", {
      method: "PUT",
      body: { ...form.value, introduction: paragraphs },
    });
    form.value.introduction = paragraphs;
    message.value = "简介已保存，前台会显示最新内容。";
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-kicker">PROFILE</p>
        <h1>简介管理</h1>
      </div>
    </header>

    <p v-if="loading" class="admin-loading">正在读取简介…</p>
    <form v-else class="admin-editor" @submit.prevent="save">
      <p v-if="message" class="admin-message" role="status">{{ message }}</p>
      <p v-if="error" class="admin-message admin-message--error" role="alert">{{ error }}</p>
      <div class="admin-form-grid">
        <div class="admin-field">
          <label for="profile-name">名字</label>
          <input id="profile-name" v-model="form.name" required />
        </div>
        <div class="admin-field">
          <label for="profile-english">英文名字</label>
          <input id="profile-english" v-model="form.englishName" required />
        </div>
        <ImageField v-model="form.avatar" label="头像图片" />
        <div class="admin-field admin-field--full">
          <label for="profile-introduction">简介内容</label>
          <textarea
            id="profile-introduction"
            v-model="introduction"
            rows="12"
            required
          />
          <small>使用空行分隔段落，前台会按相同段落展示。</small>
        </div>
      </div>
      <div class="admin-form-actions">
        <button class="admin-button" type="submit" :disabled="saving">
          <LoaderCircle v-if="saving" class="spin" :size="16" aria-hidden="true" />
          <Save v-else :size="16" aria-hidden="true" />
          {{ saving ? "正在保存" : "保存简介" }}
        </button>
      </div>
    </form>
  </div>
</template>
