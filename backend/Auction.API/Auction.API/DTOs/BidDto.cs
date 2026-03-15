namespace Auction.API.DTOs
{
    public class CreateBidDto
    {
        public int AuctionId { get; set; }
        public int UserId { get; set; } // For development; use JWT in production
        public decimal BidAmount { get; set; }
    }

    public class BidDto
    {
        public int BidId { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    }

    public class AdminBidDto
    {
        public int BidId { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    }
}
