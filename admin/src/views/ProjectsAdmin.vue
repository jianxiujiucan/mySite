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
  type AdminProject,
} from "../api";

type ProjectDraft = Omit<AdminProject, "features"> & { featuresText: string };

const projects = ref<AdminProject[]>([]);
const draft = ref<ProjectDraft | null>(null);
const loading = ref(true);
const saving = ref(false);
const message = ref("");
const error = ref("");

function toDraft(project: AdminProject): ProjectDraft {
  return {
    ...structuredClone(toRaw(project)),
    featuresText: project.features.join("\n"),
  };
}

function createProject() {
  draft.value = {
    id: 0,
    slug: `project-${Date.now()}`,
    title: "",
    english: "",
    summary: "",
    description: "",
    image: "",
    featuresText: "",
    relatedRoute: "",
    relatedLabel: "查看项目",
  };
  message.value = "";
  error.value = "";
}

async function load(selectId?: number) {
  const content = await adminApi.getContent();
  projects.value = content.projects;
  const selected = content.projects.find((project) => project.id === selectId);
  if (selected) draft.value = toDraft(selected);
  else if (draft.value?.id) {
    const current = content.projects.find((project) => project.id === draft.value!.id);
    draft.value = current ? toDraft(current) : null;
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
  const { featuresText, ...fields } = draft.value;
  const body = {
    ...fields,
    features: featuresText.split("\n").map((item) => item.trim()).filter(Boolean),
  };
  try {
    const isNew = !draft.value.id;
    const result = await adminRequest<{ id?: number }>(
      isNew ? "/projects" : `/projects/${draft.value.id}`,
      { method: isNew ? "POST" : "PUT", body },
    );
    await load(isNew ? result.id : draft.value.id);
    message.value = "项目内容已保存。";
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function remove() {
  if (!draft.value?.id || !window.confirm(`确定删除“${draft.value.title}”吗？`)) return;
  error.value = "";
  try {
    await adminRequest(`/projects/${draft.value.id}`, { method: "DELETE" });
    const removedId = draft.value.id;
    draft.value = null;
    await load();
    if (!draft.value && projects.value.length) {
      draft.value = toDraft(projects.value.find((item) => item.id !== removedId)!);
    }
    message.value = "项目已删除。";
  } catch (reason) {
    error.value = errorMessage(reason);
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-kicker">PROJECTS</p>
        <h1>项目管理</h1>
      </div>
      <button class="admin-button" type="button" @click="createProject">
        <Plus :size="16" aria-hidden="true" />
        新建项目
      </button>
    </header>

    <p v-if="message" class="admin-message" role="status">{{ message }}</p>
    <p v-if="error" class="admin-message admin-message--error" role="alert">{{ error }}</p>
    <p v-if="loading" class="admin-loading">正在读取项目…</p>
    <div v-else class="admin-split">
      <div class="admin-list">
        <button
          v-for="project in projects"
          :key="project.id"
          class="admin-list__item"
          :class="{ 'is-active': draft?.id === project.id }"
          type="button"
          @click="draft = toDraft(project)"
        >
          <span>
            {{ project.title }}
            <small>{{ project.slug }}</small>
          </span>
          <Pencil :size="15" aria-hidden="true" />
        </button>
        <p v-if="!projects.length" class="admin-empty">还没有项目，点击“新建项目”开始。</p>
      </div>

      <form v-if="draft" class="admin-editor" @submit.prevent="save">
        <div class="admin-editor__header">
          <h2>{{ draft.id ? "编辑项目" : "新建项目" }}</h2>
        </div>
        <div class="admin-form-grid">
          <div class="admin-field">
            <label for="project-title">项目名称</label>
            <input id="project-title" v-model="draft.title" required />
          </div>
          <div class="admin-field">
            <label for="project-english">英文名称</label>
            <input id="project-english" v-model="draft.english" required />
          </div>
          <div class="admin-field admin-field--full">
            <label for="project-slug">页面标识</label>
            <input id="project-slug" v-model="draft.slug" required />
            <small>用于 /projects/标识，建议使用小写英文和连字符。</small>
          </div>
          <ImageField v-model="draft.image" label="项目封面" />
          <div class="admin-field admin-field--full">
            <label for="project-summary">项目摘要</label>
            <textarea id="project-summary" v-model="draft.summary" rows="3" required />
          </div>
          <div class="admin-field admin-field--full">
            <label for="project-description">项目详情</label>
            <textarea id="project-description" v-model="draft.description" rows="6" required />
          </div>
          <div class="admin-field admin-field--full">
            <label for="project-features">项目特点</label>
            <textarea id="project-features" v-model="draft.featuresText" rows="4" />
            <small>每行一项，会显示在项目详情页。</small>
          </div>
          <div class="admin-field">
            <label for="project-route">关联链接</label>
            <input
              id="project-route"
              v-model="draft.relatedRoute"
              placeholder="https://example.com/project"
              required
            />
            <small>请填写完整的项目链接，点击后将在新标签页打开。</small>
          </div>
          <div class="admin-field">
            <label for="project-label">链接文字</label>
            <input id="project-label" v-model="draft.relatedLabel" required />
          </div>
        </div>
        <div class="admin-form-actions">
          <button class="admin-button" type="submit" :disabled="saving">
            <LoaderCircle v-if="saving" class="spin" :size="16" aria-hidden="true" />
            <Save v-else :size="16" aria-hidden="true" />
            {{ saving ? "正在保存" : "保存项目" }}
          </button>
          <button
            v-if="draft.id"
            class="admin-button admin-button--danger"
            type="button"
            @click="remove"
          >
            <Trash2 :size="16" aria-hidden="true" />
            删除项目
          </button>
        </div>
      </form>
      <p v-else class="admin-empty">选择一个项目进行编辑，或新建项目。</p>
    </div>
  </div>
</template>
