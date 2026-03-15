namespace Auction.API.Models
{
    public class Auction
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = "Active"; // "Active", "Ended", "Closed"

        // Foreign key
        public Product Product { get; set; } = null!;

        // Navigation properties
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public AuctionWinner? Winner { get; set; }
    }
}
