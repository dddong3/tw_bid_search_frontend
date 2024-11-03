<template>
  <div class="w-screen h-screen flex flex-col">
    <!-- 搜索與範圍選擇 -->
    <div class="flex w-full justify-center items-center mt-4 mb-4">
      <div class="flex w-2/3 gap-4 items-center">
        <a-input-search
          placeholder="輸入物品名稱進行搜尋"
          v-model:value.lazy="searchQuery"
          class="search-input w-full"
          allow-clear
        />
        <a-range-picker
          v-model:value="dateRange"
          @change="onDateChange"
          format="YYYY-MM-DD"
          :placeholder="['法拍開始日期', '法拍結束日期']"
          class="w-full"
        />
      </div>
    </div>

    <div ref="scrollContainer" class="scroll-container flex-1 overflow-y-auto" @scroll="saveScrollPosition">
      <a-spin :spinning="loading" size="large" tip="載入中...">
        <div v-if="auctionItems.length > 0" class="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <AuctionCard
            v-for="item in auctionItems"
            :key="item.id"
            :item="item"
            :loading="loading"
            v-lazy="true"
          />
        </div>
        <a-empty v-else-if="!loading" description="無相關結果" />
        <div v-else class="w-full pt-32"></div>
      </a-spin>
    </div>

    <div class="flex justify-center w-full py-4 bg-gray-100">
      <a-pagination
        :current="pagination.current"
        :total="totalItems"
        :pageSize="pagination.pageSize"
        show-size-changer
        :pageSizeOptions="['10', '20', '50', '100']"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import AuctionCard from '~/components/AuctionCard.vue';
import { useAuctionItemsWithQuery } from '~/composables/useAuctionItemsWithQuery';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';




const formatToYYYYMMDD = (date) => date.format('YYYY-MM-DD');
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

  // dateRange.value = [...defaultRange];
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


const onDateChange = () => {
  fetchItemsWithQuery();
};
const fetchItemsWithQuery = debounce(async () => {
  loading.value = true;
  
  const [startDate, endDate] = dateRange.value[0] && dateRange.value[1]
    ? dateRange.value
    : defaultRange;

  try {
    const { nodes, pageInfo } = await useAuctionItemsWithQuery(
      searchQuery.value,
      formatToYYYYMMDD(startDate),
      formatToYYYYMMDD(endDate),
      pagination.value.current,
      pagination.value.pageSize
    );

    auctionItems.value = nodes;
    totalItems.value = pageInfo.totalCount;

  } catch (error) {
    console.error('Error fetching auction items:', error);
    message.error('無法載入拍賣項目，請稍後再試');
  } finally {
    loading.value = false;
  }
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

.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>