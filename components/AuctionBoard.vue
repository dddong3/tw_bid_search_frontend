<template>
  <a-card v-if="auctionItem">
    <template #title>
      <div class="card-title">
        <span class="main-title">{{ boardTitle }}</span>
        <span class="extra-info">
          更新日期: {{ formattedDate }}
        </span>
      </div>
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :span="24" class="content-section">
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
import { format } from 'date-fns';
import type { AuctionItem } from '~/types/auction';

const props = defineProps<{ auctionItem: AuctionItem | null }>();

const boardTitle = computed(() => {
  const item = props.auctionItem;
  return item ? `${item.Court} ${item.CaseYear} ${item.CaseID} 第${item.CaseNo}號` : 'Auction Board';
});

const formattedDate = computed(() => {
  const item = props.auctionItem;
  return item ? format(new Date(item.UpdatedAt), 'yyyy-MM-dd HH:mm') : '';
});
</script>

<style scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.main-title {
  font-size: 18px;
  font-weight: bold;
}

.extra-info {
  font-size: 14px;
  color: #666;
}

.content-section {
  padding: 20px;
}

@media (max-width: 768px) {
  .card-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .extra-info {
    margin-top: 8px;
    font-size: 13px;
  }
}
</style>