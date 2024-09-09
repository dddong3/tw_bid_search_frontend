<template>
  <a-card v-if="auctionItem" :title="boardTitle">
    <a-row>
      <a-col span="12">
        <AuctionDetails :auctionItem="auctionItem" />
        <PdfSection :auctionItem="auctionItem" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AuctionDetails from './AuctionDetails.vue';
import PdfSection from './PdfSection.vue';
import type { AuctionItem } from '~/types/auction';

const props = defineProps<{ auctionItem: AuctionItem | null }>();

const boardTitle = computed(() => {
  const item = props.auctionItem;
  return item ? `${item.Court} ${item.CaseYear} ${item.CaseID} 第${item.CaseNo}號` : 'Auction Board';
});
</script>
