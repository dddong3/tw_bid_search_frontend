import { useNuxtApp } from '#app';
import { gql } from 'graphql-request';
import type { AuctionItemConnection } from '~/types/auction';

const GET_AUCTION_ITEMS = gql`
  query getAuctionItems($page: Int, $limit: Int) {
    getAuctionItems(page: $page, limit: $limit) {
      nodes {
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
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        totalCount
      }
    }
  }
`;

export const useAuctionItems = async (page: number, limit: number): Promise<AuctionItemConnection> => {
  const { $graphql } = useNuxtApp();

  const result = await $graphql.request(GET_AUCTION_ITEMS, { page, limit }) as { getAuctionItems: AuctionItemConnection };
  return result.getAuctionItems;
};