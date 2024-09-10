<template>
  <a-descriptions bordered>
  <!-- <a-descriptions bordered column="1" class="description-table"> -->
    <a-descriptions-item label="名稱">{{ auctionItem.Name }}</a-descriptions-item>
    <a-descriptions-item label="數量">{{ auctionItem.Quantity }}</a-descriptions-item>
    <a-descriptions-item label="單位">{{ auctionItem.Unit }}</a-descriptions-item>
    <a-descriptions-item label="拍賣日">{{ formattedSaleDate }}</a-descriptions-item>
    <a-descriptions-item label="拍次">{{ auctionItem.SaleNo }}</a-descriptions-item>
    <a-descriptions-item label="保證金">{{ formattedDeposit }}</a-descriptions-item>
    <a-descriptions-item label="備註" :span="3">{{ auctionItem.Notes }}</a-descriptions-item>
  </a-descriptions>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import type { AuctionItem } from '~/types/auction';

const props = defineProps<{ auctionItem: AuctionItem }>();

const formattedSaleDate = format(new Date(props.auctionItem.SaleDate), 'yyyy-MM-dd');

const formattedDeposit = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD'
}).format(Number(props.auctionItem.Deposit));
</script>

<style scoped>
.a-descriptions-item {
  font-size: 16px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .a-descriptions-item {
    font-size: 14px;
  }
}
</style>