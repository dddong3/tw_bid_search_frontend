<template>
  <div class="pdf-section mt-4">
    <h4>拍賣文件</h4>
    <a-spin :spinning="loading">
      <div v-if="pdfFiles.length > 0">
        <a-button
          v-for="(pdf, index) in pdfFiles"
          :key="index"
          :type="getButtonClass(pdf)"
          class="mr-2"
          @click="viewPDF(pdf)"
        >
          查看 {{ pdf }}
        </a-button>
        <a-button
          v-for="(pdf, index) in pdfFiles"
          :key="'download-' + index"
          :class="getButtonClass(pdf)"
          class="mr-2"
          @click="downloadPDF(pdf)"
        >
          下載 {{ pdf }}
        </a-button>
      </div>
      <a-empty v-else description="沒有可用的文件"></a-empty>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps<{
  auctionItem: any | null;
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

function viewPDF(fileType: string) {
  if (!props.auctionItem) return;
  const { Court, CaseYear, CaseID, CaseNo } = props.auctionItem;
  const fileUrl = `${runtimeConfig.public.backendApiUrl}/api/files/pdf/${Court}/${CaseYear}/${CaseID}/${CaseNo}/${fileType}`;
  window.open(fileUrl, '_blank');
}

async function downloadPDF(fileType: string) {
  if (!props.auctionItem) return;
  const { Court, CaseYear, CaseID, CaseNo } = props.auctionItem;
  const fileUrl = `${runtimeConfig.public.backendApiUrl}/api/files/pdf/${Court}/${CaseYear}/${CaseID}/${CaseNo}/${fileType}`;
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to download file');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${Court}-${CaseYear}${CaseID}${CaseNo}-${fileType}.pdf`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}

function getButtonClass(pdf: string) {
  if (pdf.includes('更正公告')) return 'orange-button';
  if (pdf.includes('停拍公告')) return 'danger';
  return 'primary';
}
</script>

<style scoped>
.pdf-section {
  margin-top: 16px;
}
.orange-button {
  background-color: orange;
  border-color: orange;
  color: white;
}
.red-button {
  background-color: red;
  border-color: red;
  color: white;
}
</style>
