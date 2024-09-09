import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { gql } from 'graphql-request';
import type { AuctionItemResponse, AuctionItem, AuctionItemNode } from '~/types/auction';

const GET_AUCTION_ITEMS = gql`
  query getAuctionItemWithId($id: Int!) {
    getAuctionItemWithId(id: $id) {
      node {
        id
        CaseYear
        CaseID
        CaseNo
        SaleDate
        SaleNo
        Name
        Quantity
        Unit
        Court
        TotalPrice
        Deposit
        Notes
        Remark
      }
    }
  }
`;

export const useAuctionItemDetail = (id: number) => {
  const { $graphql } = useNuxtApp();
  const auctionItem = ref<AuctionItem | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  

  const fetchAuctionItemDetail = async () => {
    try {
      if (isNaN(id)) {
        throw new Error('Invalid auction item ID');
      }

      const result = await $graphql.request<AuctionItemNode>(GET_AUCTION_ITEMS, { id });
      auctionItem.value = result?.getAuctionItemWithId?.node || null;

      if (!auctionItem.value) {
        throw new Error('Auction item not found');
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      }
      else {
        error.value = 'Error fetching auction item';
      }
    } finally {
      loading.value = false;
    }
  };

  return { auctionItem, loading, error, fetchAuctionItemDetail };
};