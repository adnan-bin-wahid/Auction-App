import { Product } from './product.model';

export interface Auction {
  auctionId: number;
  productId: number;
  startTime: string;
  endTime: string;
  status: string;
  product?: Product;
}

export interface CreateAuctionRequest {
  productId: number;
  startTime: string;
  endTime: string;
}
