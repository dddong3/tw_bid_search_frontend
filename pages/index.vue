<template>
  <div ref="scrollContainer" class="scroll-container" @scroll="saveScrollPosition">
    <a-spin :spinning="loading">
      <div class="card-container">
        <AuctionCard v-for="item in auctionItems" :key="item.id" :item="item" :loading="loading" />
      </div>
    </a-spin>
    <a-pagination
      :current="pagination.current"
      :total="totalItems"
      :pageSize="pagination.pageSize"
      @change="onPageChange"
      @showSizeChange="onPageSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AuctionCard from '~/components/AuctionCard.vue';
import { useAuctionItems } from '~/composables/useAuctionItems';

const auctionItems = ref([]);
const totalItems = ref(0);
const loading = ref(true);

const scrollContainer = ref(null);

const pagination = ref({
  current: 1,
  pageSize: 10,
});
let isPageSizeChanging = false;

onMounted(() => {
  const savedPage = localStorage.getItem('currentPage');
  const savedPageSize = localStorage.getItem('pageSize');
  const savedScrollPosition = localStorage.getItem('scrollPosition');

  if (savedPage) {
    pagination.value.current = parseInt(savedPage, 10);
  }

  if (savedPageSize) {
    pagination.value.pageSize = parseInt(savedPageSize, 10);
  }

  fetchItems();

  setTimeout(() => {
    if (savedScrollPosition && scrollContainer.value) {
      scrollContainer.value.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, 100);
});

function saveScrollPosition() {
  if (scrollContainer.value) {
    localStorage.setItem('scrollPosition', scrollContainer.value.scrollTop);
  }
}

onBeforeUnmount(() => {
  saveScrollPosition();
});

const fetchItems = async () => {
  loading.value = true;

  const result = await useAuctionItems(pagination.value.current, pagination.value.pageSize);
  auctionItems.value = result.nodes;
  totalItems.value = result.pageInfo.totalCount;

  loading.value = false;
};

const onPageChange = (newPage) => {
  if (isPageSizeChanging) {
    isPageSizeChanging = false;
    return;
  }
  pagination.value.current = newPage;
  localStorage.setItem('currentPage', newPage);
  fetchItems();
};

const onPageSizeChange = (current, newSize) => {
  pagination.value.pageSize = newSize;
  pagination.value.current = 1;
  localStorage.setItem('pageSize', newSize);
  isPageSizeChanging = true;
  fetchItems();
};
</script>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.scroll-container {
  max-height: 80vh;
  overflow-y: auto;
}
</style>