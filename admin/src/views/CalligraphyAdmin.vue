<script setup lang="ts">
import {
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-vue-next";
import { onMounted, ref, toRaw } from "vue";
import ImageField from "../components/ImageField.vue";
import {
  adminApi,
  adminRequest,
  errorMessage,
  type AdminWork,
} from "../api";

const works = ref<AdminWork[]>([]);
const draft = ref<AdminWork | null>(null);
const loading = ref(true);
const saving = ref(false);
const message = ref("");
const error = ref("");

function select(work: AdminWork) {
  draft.value = structuredClone(toRaw(work));
  message.value = "";
  error.value = "";
}

function createWork() {
  draft.value = {
    id: 0,
    slug: `work-${Date.now()}`,
    title: "",
    src: "",
    alt: "",
    ratio: "4 / 5",
    description: "",
  };
  message.value = "";
  error.value = "";
}

async function load(selectId?: number) {
  const content = await adminApi.getContent();
  works.value = content.calligraphy;
  const selected = content.calligraphy.find((work) => work.id === selectId);
  if (selected) draft.value = structuredClone(selected);
  else if (draft.value?.id) {
    const current = content.calligraphy.find((work) => work.id === draft.value!.id);
    draft.value = current ? structuredClone(current) : null;
  }
}

onMounted(async () => {
  try {
    await load();
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    loading.value = false;
  }
});

async function save() {
  if (!draft.value) return;
  saving.value = true;
  message.value = "";
  error.value = "";
  try {
    const isNew = !draft.value.id;
    const result = await adminRequest<{ id?: number }>(
      isNew ? "/calligraphy" : `/calligraphy/${draft.value.id}`,
      { method: isNew ? "POST" : "PUT", body: draft.value },
    );
    await load(isNew ? result.id : draft.value.id);
    message.value = "书法作品已保存。";
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function remove() {
  if (!draft.value?.id || !window.confirm(`确定删除“${draft.value.title}”吗？`)) return;
  try {
    await adminRequest(`/calligraphy/${draft.value.id}`, { method: "DELETE" });
    draft.value = null;
    await load();
    if (!draft.value && works.value.length) select(works.value[0]);
    message.value = "书法作品已删除。";
  } catch (reason) {
    error.value = errorMessage(reason);
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-kicker">CALLIGRAPHY</p>
        <h1>书法管理</h1>
      </div>
      <button class="admin-button" type="button" @click="createWork">
        <Plus :size="16" aria-hidden="true" />
        添加作品
      </button>
    </header>

    <p v-if="message" class="admin-message" role="status">{{ message }}</p>
    <p v-if="error" class="admin-message admin-message--error" role="alert">{{ error }}</p>
    <p v-if="loading" class="admin-loading">正在读取书法作品…</p>
    <div v-else class="admin-split">
      <div class="admin-list">
        <button
          v-for="work in works"
          :key="work.id"
          class="admin-list__item"
          :class="{ 'is-active': draft?.id === work.id }"
          type="button"
          @click="select(work)"
        >
          <span>
            {{ work.title }}
            <small>{{ work.slug }}</small>
          </span>
          <Pencil :size="15" aria-hidden="true" />
        </button>
        <p v-if="!works.length" class="admin-empty">还没有书法作品。</p>
      </div>

      <form v-if="draft" class="admin-editor" @submit.prevent="save">
        <div class="admin-editor__header">
          <h2>{{ draft.id ? "编辑作品" : "添加作品" }}</h2>
        </div>
        <div class="admin-form-grid">
          <div class="admin-field">
            <label for="work-title">作品标题</label>
            <input id="work-title" v-model="draft.title" required />
          </div>
          <div class="admin-field">
            <label for="work-slug">内容标识</label>
            <input id="work-slug" v-model="draft.slug" required />
          </div>
          <ImageField v-model="draft.src" label="书法作品图片" />
          <div class="admin-field admin-field--full">
            <label for="work-alt">无障碍描述</label>
            <input id="work-alt" v-model="draft.alt" required />
          </div>
          <div class="admin-field">
            <label for="work-ratio">照片墙显示比例</label>
            <select id="work-ratio" v-model="draft.ratio">
              <option value="1 / 1">1:1 方形</option>
              <option value="4 / 5">4:5 竖幅</option>
              <option value="3 / 4">3:4 竖幅</option>
              <option value="2 / 3">2:3 长竖幅</option>
            </select>
          </div>
          <div class="admin-field admin-field--full">
            <label for="work-description">作品详情</label>
            <textarea id="work-description" v-model="draft.description" rows="5" />
          </div>
        </div>
        <div class="admin-form-actions">
          <button class="admin-button" type="submit" :disabled="saving">
            <LoaderCircle v-if="saving" class="spin" :size="16" aria-hidden="true" />
            <Save v-else :size="16" aria-hidden="true" />
            {{ saving ? "正在保存" : "保存作品" }}
          </button>
          <button
            v-if="draft.id"
            class="admin-button admin-button--danger"
            type="button"
            @click="remove"
          >
            <Trash2 :size="16" aria-hidden="true" />
            删除作品
          </button>
        </div>
      </form>
      <p v-else class="admin-empty">选择一件作品进行编辑，或添加作品。</p>
    </div>
  </div>
</template>
