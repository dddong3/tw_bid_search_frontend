import type { Int } from "graphql-request/alpha/schema/scalars";

export interface PageInfo {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
}

export interface AuctionItem {
  id: string;
  CaseYear: Int;
  CaseID: string;
  CaseNo: string;
  SaleDate: string;
  SaleNo: Int;
  Name: string;
  Quantity: string;
  Unit: string;
  Court: string;
  TotalPrice: Int
  Deposit: Int;
  Notes: string;
  Remark: string;
  UpdatedAt: string;
}

export interface AuctionItemConnection {
  nodes: AuctionItem[];
  pageInfo: PageInfo;
}

export interface SingleAuctionItem {
  node: AuctionItem;
}

export interface AuctionItemNode {
  getAuctionItemWithId: {
    node: AuctionItem;
  };
}

export interface AuctionItemResponse {
  getAuctionItemWithId: AuctionItemNode;
}
