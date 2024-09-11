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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuctionDetails from './AuctionDetails.vue';
import PdfSection from './PdfSection.vue';
import RelatedItems from '~/components/RelatedItems.vue';
import { useAuctionItemDetail } from '~/composables/useAuctionItemDetail';
import { useRelatedAuctionItems } from '~/composables/useRelatedAuctionItems';
import { format } from 'date-fns';
import type { AuctionItem } from '~/types/auction';

const route = useRoute();
const router = useRouter();

const auctionItem = ref<AuctionItem | null>(null);
const relatedItems = ref<AuctionItem[]>([]);

const loadAuctionItemDetails = async (id: string) => {
  const { auctionItem: fetchedAuctionItem, fetchAuctionItemDetail } = await useAuctionItemDetail(Number(id));
  await fetchAuctionItemDetail();
  auctionItem.value = fetchedAuctionItem.value;
  if (auctionItem.value) loadRelatedItems();
};

const loadRelatedItems = async () => {
  if (auctionItem.value) {
    const { Court, CaseID, CaseNo, CaseYear } = auctionItem.value;
    relatedItems.value = await useRelatedAuctionItems(Court, CaseID, CaseNo, String(CaseYear));
  }
};

onMounted(() => {
  const itemId = route.query.id;
  if (itemId) loadAuctionItemDetails(itemId as string);
});

watch(() => route.query.id, (newId) => {
  if (newId) loadAuctionItemDetails(newId as string);
});

function goToAuctionItem(rowId: string) {
  router.push(`/auction/item?id=${rowId}`);
}

const boardTitle = computed(() => {
  if (!auctionItem.value) return 'Auction Board';
  const { Court, CaseYear, CaseID, CaseNo } = auctionItem.value;
  return `${Court} ${CaseYear} ${CaseID} 第${CaseNo}號`;
});

const formattedDate = computed(() => {
  return auctionItem.value ? format(new Date(auctionItem.value.UpdatedAt), 'yyyy-MM-dd HH:mm') : '';
});
</script>

<style scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main-title {
  font-size: 18px;
  font-weight: bold;
}
.extra-info {
  font-size: 14px;
  color: #666;
}
</style>