namespace Auction.API.Models
{
    public class AuctionWinner
    {
        public int WinnerId { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
        public int BidId { get; set; }
        public decimal WinningAmount { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public Auction Auction { get; set; } = null!;
        public User User { get; set; } = null!;
        public Bid Bid { get; set; } = null!;
    }
}
