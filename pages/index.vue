<template>
  <div ref="scrollContainer" class="scroll-container" @scroll="saveScrollPosition">
    <div class="search-bar">
      <a-input-search
        placeholder="輸入物品名稱進行搜尋"
        v-model:value.lazy="searchQuery"
        class="search-input"
        allow-clear
      />

    <a-form layout="vertical">
      <a-form-item label="選擇日期範圍">
        <a-range-picker
          v-model:value="dateRange"
          @change="onDateChange"
          format="YYYY-MM-DD"
          :placeholder="['開始日期', '結束日期']"
        />
      </a-form-item>
    </a-form>
    </div>

    <a-spin :spinning="loading">
      <div class="card-container">
        <AuctionCard
          v-for="item in auctionItems"
          :key="item.id"
          :item="item"
          :loading="loading"
        />
      </div>
    </a-spin>

    <a-pagination
      v-if="totalItems > 0"
      :current="pagination.current"
      :total="totalItems"
      :pageSize="pagination.pageSize"
      show-size-changer
      :pageSizeOptions="['10', '20', '50', '100']"
      @change="onPageChange"
      @showSizeChange="onPageSizeChange"
    />
    <a-empty v-else description="無相關結果" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import AuctionCard from '~/components/AuctionCard.vue';
import { useAuctionItemsWithQuery } from '~/composables/useAuctionItemsWithQuery';
// import { useAuctionItems } from '~/composables/useAuctionItems';
import { debounce } from 'lodash';
// import { se } from 'date-fns/locale/se';
import dayjs from 'dayjs';

// 設定初始日期範圍


const auctionItems = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const searchQuery = ref('');

const scrollContainer = ref(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
let isPageSizeChanging = false;

const defaultStartDate = dayjs();
const defaultEndDate = defaultStartDate.add(3, 'month');
const defaultRange = [defaultStartDate, defaultEndDate];
const dateRange = ref([]);


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

  fetchItemsWithQuery();

  setTimeout(() => {
    if (savedScrollPosition && scrollContainer.value) {
      scrollContainer.value.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, 100);

  dateRange.value = [...defaultRange];
});

onBeforeUnmount(() => {
  saveScrollPosition();
});

const onPageChange = (newPage) => {
  if (isPageSizeChanging) {
    isPageSizeChanging = false;
    return;
  }
  pagination.value.current = newPage;
  localStorage.setItem('currentPage', newPage);
  fetchItemsWithQuery();
};

const onPageSizeChange = (current, newSize) => {
  pagination.value.pageSize = newSize;
  pagination.value.current = 1;
  localStorage.setItem('pageSize', newSize);
  isPageSizeChanging = true;
  // fetchItems();
  fetchItemsWithQuery();
};

// 當搜尋或過濾條件改變時觸發
const onSearch = () => {
  pagination.value.current = 1;
  fetchItemsWithQuery();
};

watch(searchQuery, onSearch);


const onDateChange = (dates) => {
  // console.log('Selected Date Range: ', dates);
  // console.log(dateRange.value[0].year(), dateRange.value[0].month() + 1, dateRange.value[0].date());
  // console.log(dateRange.value[1].year(), dateRange.value[1].month() + 1, dateRange.value[1].date());
  fetchItemsWithQuery();
};

const fetchItemsWithQuery = debounce(async () => {
  loading.value = true;
  console.log(searchQuery.value);
  console.log(searchQuery);
  const result = await useAuctionItemsWithQuery(
    searchQuery.value,
    dateRange.value[0].format('YYYY-MM-DD'),
    dateRange.value[1].format('YYYY-MM-DD'),
    pagination.value.current,
    pagination.value.pageSize,
  );
  
  auctionItems.value = result.nodes;
  totalItems.value = result.pageInfo.totalCount;
  loading.value = false;
}, 300);

function saveScrollPosition() {
  if (scrollContainer.value) {
    localStorage.setItem('scrollPosition', scrollContainer.value.scrollTop);
  }
}


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

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  flex-grow: 1;
  margin-right: 16px;
}

.expired-filter {
  margin-left: 16px;
}

a-empty {
  text-align: center;
  margin-top: 20px;
}
</style>