<template>
  <div class="related-items-container">
    <h4>相關拍賣物品</h4>
    <div class="related-items-wrapper" v-if="items.length > 0">
      <div
        class="related-item-card"
        v-for="item in items"
        :key="item.id"
        @click="handleClick(item.id)"
      >
        <a-spin :spinning="loading">
          <a-card>
            <p><strong>{{ item.Name }}</strong></p>
            <p>拍賣日: {{ formatSaleDate(item.SaleDate) }}</p>
            <p v-if="typeof item.TotalPrice === 'number'">總價: {{ currencyFormat(item.TotalPrice) }}</p>
            <p v-else>總價: 資料無效</p>
          </a-card>
        </a-spin>
      </div>
    </div>
    <a-empty :image="simpleImage" v-else description="沒有相關拍賣物品"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
import { format, set } from 'date-fns';
import type { AuctionItem } from '~/types/auction';

const loading = ref(false);

const props = defineProps({
  items: {
    type: Array as () => AuctionItem[],
    required: true,
  },
});

const emit = defineEmits(['itemClick']);

watch(
  () => props.items,
  (newItems, oldItems) => {
    if (newItems !== oldItems) {
      setTimeout(() => {
          loading.value = false;
      }, 200);
    }
  },
  { immediate: true }
);

const handleClick = (id: string) => {
  emit('itemClick', id);
  loading.value = true;
};

function currencyFormat(value: number) {
  if (typeof value !== 'number') {
    console.error('Invalid value passed to currencyFormat:', value);
    return '資料無效';
  }

  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
  }).format(value);
}

const formatSaleDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd');
};
</script>

<style scoped>
.related-items-wrapper {
  display: flex;
  overflow-x: auto;
  padding-bottom: 16px;
}

.related-item-card {
  flex: 0 0 auto;
  width: 240px;
  margin-right: 16px;
}
</style>