<template>
  <div class="pdf-section mt-4">
    <h4>拍賣文件</h4>
    <a-spin :spinning="loading">
      <div v-if="pdfFiles.length > 0">
        <a-button
          v-for="(pdf, index) in pdfFiles"
          :key="index"
          :class="getButtonClass(pdf)"
          class="mr-2"
          @mousedown="(event: MouseEvent) => viewPDF(pdf, event)"
        >
          查看 {{ pdf }}
        </a-button>
      </div>
      <a-empty v-else description="沒有可用的文件"></a-empty>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import type { AuctionItem } from '~/types/auction'; // 引入 AuctionItem 類型

const props = defineProps<{
  auctionItem: AuctionItem | null;
}>();

const pdfFiles = ref<string[]>([]);
const loading = ref(false);
const runtimeConfig = useRuntimeConfig();

onMounted(fetchPDFFiles);
watch(() => props.auctionItem, fetchPDFFiles, { immediate: true });

async function fetchPDFFiles() {
  if (!props.auctionItem) return;
  const { Court, CaseYear, CaseID, CaseNo } = props.auctionItem;
  const apiUrl = `${runtimeConfig.public.backendApiUrl}/api/files/pdf/${Court}/${CaseYear}/${CaseID}/${CaseNo}/types`;

  loading.value = true;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch PDF files');
    const result = await response.json();
    pdfFiles.value = result;
  } catch (error) {
    console.error('Error fetching PDF files:', error);
  } finally {
    loading.value = false;
  }
}

function viewPDF(fileType: string, event: MouseEvent) {
  if (!props.auctionItem) return;
  const { Court, CaseYear, CaseID, CaseNo } = props.auctionItem;
  const fileUrl = `${runtimeConfig.public.backendApiUrl}/api/files/pdf/${Court}/${CaseYear}/${CaseID}/${CaseNo}/${fileType}`;
  if(event.button === 0 || event.button === 1 || event.ctrlKey || event.metaKey) {
    window.open(fileUrl, '_blank');
  }    
}

function getButtonClass(pdf: string) {
  if (pdf.includes('更正公告')) return 'warning-button';
  if (pdf.includes('停拍公告')) return 'danger-button';
  return 'default-button';
}
</script>

<style scoped>
.pdf-section {
  margin-top: 16px;
}

.warning-button {
  background-color: #faad14;
  border-color: #faad14;
  color: white;
}

.danger-button {
  background-color: #f5222d;
  border-color: #f5222d;
  color: white;
}

.default-button {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}
</style>