<template>
  <a-card v-if="auctionItem">
    <template #title>
      <div class="card-title">
        <span class="main-title">{{ boardTitle }}</span>
        <span class="extra-info">更新日期: {{ formattedDate }}</span>
      </div>
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :span="24" class="content-section">
        <AuctionDetails :auctionItem="auctionItem" />
        <PdfSection :auctionItem="auctionItem" />
      </a-col>
    </a-row>

    <RelatedItems :items="relatedItems" @itemClick="goToAuctionItem" />
  </a-card>
  <a-spin v-if="loading" />
  <a-alert v-if="error" :message="error" type="error" show-icon />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuctionDetails from '~/components/AuctionDetails.vue';
import PdfSection from '~/components/PdfSection.vue';
import RelatedItems from '~/components/RelatedItems.vue';
import { useAuctionItemDetail } from '~/composables/useAuctionItemDetail';
import { useRelatedAuctionItems } from '~/composables/useRelatedAuctionItems';
import { format } from 'date-fns';
import type { AuctionItem } from '~/types/auction';

const route = useRoute();
const router = useRouter();

const auctionItem = ref<AuctionItem | null>(null);
const relatedItems = ref<AuctionItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const boardTitle = computed(() => {
  if (!auctionItem.value) return 'Auction Board';
  const { Court, CaseYear, CaseID, CaseNo } = auctionItem.value;
  return `${Court} ${CaseYear} ${CaseID} 第${CaseNo}號`;
});

const formattedDate = computed(() => {
  if (!auctionItem.value) return '';
  return format(new Date(auctionItem.value.UpdatedAt), 'yyyy-MM-dd HH:mm');
});

const loadAuctionItemDetails = async (id: string) => {
  loading.value = true;
  error.value = null;

  try {
    const { auctionItem: fetchedAuctionItem, fetchAuctionItemDetail } = useAuctionItemDetail(Number(id));
    
    await fetchAuctionItemDetail();

    if (fetchedAuctionItem.value) {
      auctionItem.value = fetchedAuctionItem.value;
      await loadRelatedItems();
    }
  } catch (err) {
    error.value = 'Error fetching auction item';
  } finally {
    loading.value = false;
  }
};

const loadRelatedItems = async () => {
  if (!auctionItem.value) return;

  const { Court, CaseID, CaseNo, CaseYear } = auctionItem.value;

  if (!CaseYear) {
    console.error('CaseYear is missing');
    return;
  }

  try {
    const items = await useRelatedAuctionItems(Court, CaseID, CaseNo, String(CaseYear));
    relatedItems.value = items.filter(
      (item) => item.RowId !== auctionItem.value!.RowId
    );
  } catch (err) {
    error.value = 'Failed to fetch related auction items';
  }
};

onMounted(() => {
  const itemId = route.query.id;
  if (itemId) {
    loadAuctionItemDetails(itemId as string);
  }
});

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      loadAuctionItemDetails(newId as string);
    }
  }
);

const goToAuctionItem = (id: string) => {
  router.push(`/auction/item?id=${id}`);
};
</script>

<style scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-section {
  padding: 20px;
}
</style>