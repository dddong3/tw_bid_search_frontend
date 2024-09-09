<template>
  <a-card :loading="loading" hoverable @click="navigateToDetail(item)">
    <template #cover>
      <!-- <img :src="item.PicturePath" alt="auction image" /> -->
    </template>
    <a-card-meta
      :title="`${item.Name}  * ${item.Quantity} (${item.Unit})`"
    >
      <template #description>
        <div>
          <p><strong>拍賣日:</strong> {{ formatSaleDate(item.SaleDate) }} 第 {{ item.SaleNo }} 拍</p>
          <p><strong>案件號碼:</strong> {{ item.CaseYear }}{{ item.CaseID }}{{ item.CaseNo }}號</p>
          <p v-if="item.Deposit != 0"><strong>保證金: {{ item.Deposit }}</strong></p>
          <p>{{ item.Court }}</p>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { formatSaleDate } from '~/utils/date';

defineProps({
  item: Object,
  loading: Boolean
});

const router = useRouter();

const navigateToDetail = (item) => {
  router.push(`/auction/item?id=${item.id}`);
};


const handleClick = (item) => {
  console.log(item.id);
};

</script>

<style scoped>
img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

p {
  margin: 0;
  line-height: 1.5;
}
</style>