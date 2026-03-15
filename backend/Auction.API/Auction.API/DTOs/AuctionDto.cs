namespace Auction.API.DTOs
{
    public class CreateAuctionDto
    {
        public int ProductId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class AuctionDto
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public ProductDto? Product { get; set; }
    }
}
