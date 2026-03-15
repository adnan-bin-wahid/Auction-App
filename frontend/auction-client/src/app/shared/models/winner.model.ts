export interface AuctionWinner {
  winnerId: number;
  auctionId: number;
  userId: number;
  bidId: number;
  winningAmount: number;
  assignedAt: string;
  product?: {
    productId: number;
    name: string;
  };
}
