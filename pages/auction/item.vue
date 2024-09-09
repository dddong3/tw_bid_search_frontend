<template>
  <div class="auction-item-detail">
    <a-spin :spinning="loading" tip="Loading...">
      <AuctionBoard v-if="auctionItem" :auctionItem="auctionItem" />
      <a-empty v-else-if="!loading && !auctionItem" description="No auction item details available"></a-empty>
      <a-alert v-else-if="error" type="error" :message="error"></a-alert>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuctionItemDetail } from '~/composables/useAuctionItemDetail.ts';
import AuctionBoard from '~/components/AuctionBoard.vue';



const route = useRoute();
const id = Number(route.query.id);

const { auctionItem, loading, error, fetchAuctionItemDetail } = useAuctionItemDetail(id);

onMounted(fetchAuctionItemDetail);
</script>

<style scoped>
.auction-item-detail {
  padding: 24px;
}
</style>