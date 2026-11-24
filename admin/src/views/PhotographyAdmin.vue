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
  type AdminAlbum,
  type AdminPhoto,
} from "../api";

const albums = ref<AdminAlbum[]>([]);
const draft = ref<AdminAlbum | null>(null);
const loading = ref(true);
const saving = ref(false);
const savingPhoto = ref<number | null>(null);
const message = ref("");
const error = ref("");

function select(album: AdminAlbum) {
  draft.value = structuredClone(toRaw(album));
  message.value = "";
  error.value = "";
}

function createAlbum() {
  draft.value = {
    id: 0,
    slug: `album-${Date.now()}`,
    title: "",
    subtitle: "",
    description: "",
    photos: [],
  };
  message.value = "";
  error.value = "";
}

async function load(selectId?: number) {
  const content = await adminApi.getContent();
  albums.value = content.albums;
  const selected = content.albums.find((album) => album.id === selectId);
  if (selected) draft.value = structuredClone(selected);
  else if (draft.value?.id) {
    const current = content.albums.find((album) => album.id === draft.value!.id);
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

async function saveAlbum() {
  if (!draft.value) return;
  saving.value = true;
  message.value = "";
  error.value = "";
  try {
    const isNew = !draft.value.id;
    const result = await adminRequest<{ id?: number }>(
      isNew ? "/albums" : `/albums/${draft.value.id}`,
      { method: isNew ? "POST" : "PUT", body: draft.value },
    );
    await load(isNew ? result.id : draft.value.id);
    message.value = "相册信息已保存。";
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    saving.value = false;
  }
}

function addPhoto() {
  if (!draft.value?.id) return;
  draft.value.photos.push({
    id: 0,
    albumId: draft.value.id,
    src: "",
    alt: "",
    title: "",
    description: "",
  });
}

async function savePhoto(photo: AdminPhoto, index: number) {
  if (!draft.value?.id) return;
  savingPhoto.value = index;
  message.value = "";
  error.value = "";
  try {
    await adminRequest(
      photo.id ? `/photos/${photo.id}` : `/albums/${draft.value.id}/photos`,
      { method: photo.id ? "PUT" : "POST", body: photo },
    );
    await load(draft.value.id);
    message.value = "照片内容已保存。";
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    savingPhoto.value = null;
  }
}

async function removePhoto(photo: AdminPhoto, index: number) {
  if (!photo.id) {
    draft.value?.photos.splice(index, 1);
    return;
  }
  if (!window.confirm(`确定删除照片“${photo.title}”吗？`)) return;
  try {
    await adminRequest(`/photos/${photo.id}`, { method: "DELETE" });
    if (draft.value?.id) await load(draft.value.id);
    message.value = "照片已删除。";
  } catch (reason) {
    error.value = errorMessage(reason);
  }
}

async function removeAlbum() {
  if (!draft.value?.id) return;
  if (!window.confirm(`确定删除“${draft.value.title}”及其中的所有照片吗？`)) return;
  try {
    await adminRequest(`/albums/${draft.value.id}`, { method: "DELETE" });
    draft.value = null;
    await load();
    if (!draft.value && albums.value.length) select(albums.value[0]);
    message.value = "相册及其中照片已删除。";
  } catch (reason) {
    error.value = errorMessage(reason);
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <div>
        <p class="admin-kicker">PHOTOGRAPHY</p>
        <h1>摄影管理</h1>
      </div>
      <button class="admin-button" type="button" @click="createAlbum">
        <Plus :size="16" aria-hidden="true" />
        新建相册
      </button>
    </header>

    <p v-if="message" class="admin-message" role="status">{{ message }}</p>
    <p v-if="error" class="admin-message admin-message--error" role="alert">{{ error }}</p>
    <p v-if="loading" class="admin-loading">正在读取相册…</p>
    <div v-else class="admin-split">
      <div class="admin-list">
        <button
          v-for="album in albums"
          :key="album.id"
          class="admin-list__item"
          :class="{ 'is-active': draft?.id === album.id }"
          type="button"
          @click="select(album)"
        >
          <span>
            {{ album.title }}
            <small>{{ album.photos.length }} 张照片</small>
          </span>
          <Pencil :size="15" aria-hidden="true" />
        </button>
        <p v-if="!albums.length" class="admin-empty">还没有相册，点击“新建相册”开始。</p>
      </div>

      <div v-if="draft" class="admin-editor">
        <form @submit.prevent="saveAlbum">
          <div class="admin-editor__header">
            <h2>{{ draft.id ? "编辑相册" : "新建相册" }}</h2>
          </div>
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="album-title">相册标题</label>
              <input id="album-title" v-model="draft.title" required />
            </div>
            <div class="admin-field">
              <label for="album-slug">页面标识</label>
              <input id="album-slug" v-model="draft.slug" required />
            </div>
            <div class="admin-field admin-field--full">
              <label for="album-subtitle">副标题</label>
              <input id="album-subtitle" v-model="draft.subtitle" />
            </div>
            <div class="admin-field admin-field--full">
              <label for="album-description">相册详情</label>
              <textarea id="album-description" v-model="draft.description" rows="4" />
            </div>
          </div>
          <div class="admin-form-actions">
            <button class="admin-button" type="submit" :disabled="saving">
              <LoaderCircle v-if="saving" class="spin" :size="16" aria-hidden="true" />
              <Save v-else :size="16" aria-hidden="true" />
              {{ saving ? "正在保存" : "保存相册" }}
            </button>
            <button
              v-if="draft.id"
              class="admin-button admin-button--danger"
              type="button"
              @click="removeAlbum"
            >
              <Trash2 :size="16" aria-hidden="true" />
              删除相册
            </button>
          </div>
        </form>

        <div class="admin-subheading">
          <h2>照片管理</h2>
          <button
            class="admin-button admin-button--secondary"
            type="button"
            :disabled="!draft.id"
            @click="addPhoto"
          >
            <Plus :size="16" aria-hidden="true" />
            添加照片
          </button>
        </div>
        <p v-if="!draft.id" class="admin-empty">请先保存相册，再添加照片。</p>
        <p v-else-if="!draft.photos.length" class="admin-empty">这个相册还没有照片。</p>
        <div v-else class="admin-photo-list">
          <form
            v-for="(photo, index) in draft.photos"
            :key="photo.id || `new-${index}`"
            class="admin-photo-editor"
            @submit.prevent="savePhoto(photo, index)"
          >
            <div class="admin-editor__header">
              <h2>{{ photo.title || `照片 ${index + 1}` }}</h2>
            </div>
            <div class="admin-form-grid">
              <ImageField v-model="photo.src" label="照片图片" />
              <div class="admin-field">
                <label :for="`photo-title-${index}`">照片标题</label>
                <input :id="`photo-title-${index}`" v-model="photo.title" required />
              </div>
              <div class="admin-field">
                <label :for="`photo-alt-${index}`">无障碍描述</label>
                <input :id="`photo-alt-${index}`" v-model="photo.alt" required />
              </div>
              <div class="admin-field admin-field--full">
                <label :for="`photo-description-${index}`">照片详情</label>
                <textarea
                  :id="`photo-description-${index}`"
                  v-model="photo.description"
                  rows="3"
                />
              </div>
            </div>
            <div class="admin-form-actions">
              <button
                class="admin-button"
                type="submit"
                :disabled="savingPhoto === index"
              >
                <LoaderCircle
                  v-if="savingPhoto === index"
                  class="spin"
                  :size="16"
                  aria-hidden="true"
                />
                <Save v-else :size="16" aria-hidden="true" />
                保存照片
              </button>
              <button
                class="admin-button admin-button--danger"
                type="button"
                @click="removePhoto(photo, index)"
              >
                <Trash2 :size="16" aria-hidden="true" />
                删除照片
              </button>
            </div>
          </form>
        </div>
      </div>
      <p v-else class="admin-empty">选择一个相册进行编辑，或新建相册。</p>
    </div>
  </div>
</template>
