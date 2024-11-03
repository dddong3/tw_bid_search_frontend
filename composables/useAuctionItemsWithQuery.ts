import { useNuxtApp } from '#app';
import { gql } from 'graphql-request';
import type { AuctionItemConnection } from '~/types/auction';

const GET_AUCTION_ITEMS_WITH_QUERY = gql`
  query getAuctionItemsWithQuery($query: String, $startDate: String!, $endDate: String!, $page: Int!, $limit: Int!) {
    getAuctionItemsWithQuery(query: $query, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit) {
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

export const useAuctionItemsWithQuery = async (query: string, startDate: string, endDate: string, page: number, limit: number): Promise<AuctionItemConnection> => {
  const { $graphql } = useNuxtApp();

  const result = await $graphql.request(GET_AUCTION_ITEMS_WITH_QUERY, { query, startDate, endDate, page, limit }) as { getAuctionItemsWithQuery: AuctionItemConnection };
  return result.getAuctionItemsWithQuery;
};