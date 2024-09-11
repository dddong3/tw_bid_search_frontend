<template>
  <a-descriptions bordered>
    <a-descriptions-item label="名稱">{{ auctionItem.Name }}</a-descriptions-item>
    <a-descriptions-item label="數量">{{ auctionItem.Quantity }}</a-descriptions-item>
    <a-descriptions-item label="單位">{{ auctionItem.Unit }}</a-descriptions-item>
    <a-descriptions-item label="拍賣日">{{ formatSaleDate(auctionItem.SaleDate) }}</a-descriptions-item>
    <a-descriptions-item label="拍次">{{ auctionItem.SaleNo }}</a-descriptions-item>
    <a-descriptions-item label="保證金">{{ auctionItem.Deposit }}</a-descriptions-item>
    <a-descriptions-item label="備註" :span="3">{{ auctionItem.Notes }}</a-descriptions-item>
  </a-descriptions>
</template>

<script setup lang="ts">
import type { AuctionItem } from '~/types/auction';
import { format } from 'date-fns';

const props = defineProps<{ auctionItem: AuctionItem }>();

const formatSaleDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd');
};
</script>