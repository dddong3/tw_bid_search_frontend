import { useNuxtApp } from '#app';
import { gql } from 'graphql-request';
import type { AuctionItem } from '~/types/auction';

const GET_RELATED_AUCTION_ITEMS = gql`
  query getRelatedAuctionItems($court: String!, $caseId: String!, $caseNo: String!, $year: String!) {
    getAuctionItemWithRelate(court: $court, caseId: $caseId, caseNo: $caseNo, year: $year) {
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
    }
  }
`;

export const useRelatedAuctionItems = async (
  court: string,
  caseId: string,
  caseNo: string,
  year: string
): Promise<AuctionItem[]> => {
  const { $graphql } = useNuxtApp();

  try {
    const response = await $graphql.request(GET_RELATED_AUCTION_ITEMS, {
      court,
      caseId,
      caseNo,
      year,
    });

    return Array.isArray(response.getAuctionItemWithRelate) ? response.getAuctionItemWithRelate : [];
  } catch (error) {
    console.error('Failed to fetch related auction items:', error);
    return [];
  }
};