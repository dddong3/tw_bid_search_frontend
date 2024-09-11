import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { gql } from 'graphql-request';

const GET_AUCTION_ITEM_BY_ID = gql`
  query getAuctionItemWithId($id: Int!) {
    getAuctionItemWithId(id: $id) {
      node {
        id
        RowId
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
        UpdatedAt
      }
    }
  }
`;

export const useAuctionItemDetail = (id: number) => {
  const auctionItem = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchAuctionItemDetail = async () => {
    const { $graphql } = useNuxtApp();
    try {
      const result = await $graphql.request(GET_AUCTION_ITEM_BY_ID, { id });
      auctionItem.value = result.getAuctionItemWithId?.node || null;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { auctionItem, loading, error, fetchAuctionItemDetail };
};