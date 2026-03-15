export interface Bid {
  bidId: number;
  auctionId: number;
  userId: number;
  bidAmount: number;
  bidTime: string;
}

export interface CreateBidRequest {
  auctionId: number;
  userId: number;
  bidAmount: number;
}

export interface AdminBid extends Bid {
  userName: string;
}
