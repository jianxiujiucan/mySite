<script setup lang="ts">
import { Image as ImageIcon, LoaderCircle, Upload } from "lucide-vue-next";
import { ref, useId, watch } from "vue";
import { adminApi, errorMessage } from "../api";

const props = defineProps<{
  modelValue: string;
  label: string;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const id = useId();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref("");
const previewFailed = ref(false);

watch(
  () => props.modelValue,
  () => {
    previewFailed.value = false;
  },
);

async function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  error.value = "";
  if (file.size > 8 * 1024 * 1024) {
    error.value = "图片不能超过 8MB";
    input.value = "";
    return;
  }
  uploading.value = true;
  try {
    const result = await adminApi.upload(file);
    emit("update:modelValue", result.url);
  } catch (reason) {
    error.value = errorMessage(reason);
  } finally {
    uploading.value = false;
    input.value = "";
  }
}
</script>

<template>
  <div class="admin-image-field">
    <label :for="id">{{ label }}</label>
    <div class="admin-image-field__preview">
      <img
        v-if="modelValue && !previewFailed"
        :src="modelValue"
        alt="当前图片预览"
        @error="previewFailed = true"
      />
      <ImageIcon v-else :size="30" aria-hidden="true" />
    </div>
    <input
      :id="id"
      type="text"
      :value="modelValue"
      placeholder="粘贴 https:// 图片外链，或上传本地图片"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div class="admin-image-field__actions">
      <button
        class="admin-button admin-button--secondary"
        type="button"
        :disabled="uploading"
        @click="fileInput?.click()"
      >
        <LoaderCircle v-if="uploading" class="spin" :size="16" aria-hidden="true" />
        <Upload v-else :size="16" aria-hidden="true" />
        {{ uploading ? "正在上传" : "上传本地图片" }}
      </button>
      <span>JPG / PNG / WebP / GIF / AVIF，最大 8MB</span>
    </div>
    <input
      ref="fileInput"
      class="admin-file-input"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
      @change="upload"
    />
    <p v-if="error" class="admin-form-error">{{ error }}</p>
  </div>
</template>
