using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Auction.API.Data;
using Auction.API.DTOs;
using Auction.API.Models;

namespace Auction.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BidsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BidsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<BidDto>> PlaceBid(CreateBidDto request)
        {
            // Validate user exists
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return BadRequest("User not found");

            // Validate auction exists and is active
            var auction = await _context.Auctions.FindAsync(request.AuctionId);
            if (auction == null)
                return BadRequest("Auction not found");

            if (auction.Status != "Active" || DateTime.UtcNow > auction.EndTime)
                return BadRequest("Auction is not active");

            // Validate bid amount
            var product = await _context.Products.FindAsync(auction.ProductId);
            if (product == null)
                return BadRequest("Product not found");

            if (request.BidAmount < product.StartingPrice)
                return BadRequest($"Bid must be at least {product.StartingPrice}");

            var bid = new Bid
            {
                AuctionId = request.AuctionId,
                UserId = request.UserId,
                BidAmount = request.BidAmount,
                BidTime = DateTime.UtcNow
            };

            _context.Bids.Add(bid);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBidById), new { id = bid.BidId },
                new BidDto
                {
                    BidId = bid.BidId,
                    AuctionId = bid.AuctionId,
                    UserId = bid.UserId,
                    BidAmount = bid.BidAmount,
                    BidTime = bid.BidTime
                });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BidDto>> GetBidById(int id)
        {
            var bid = await _context.Bids.FindAsync(id);
            if (bid == null)
                return NotFound();

            return Ok(new BidDto
            {
                BidId = bid.BidId,
                AuctionId = bid.AuctionId,
                UserId = bid.UserId,
                BidAmount = bid.BidAmount,
                BidTime = bid.BidTime
            });
        }

        [HttpGet("auction/{auctionId}")]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetBidsForAuction(int auctionId)
        {
            // In production, verify user is admin or the auction is ended
            var bids = await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .ToListAsync();

            return Ok(bids.Select(b => new BidDto
            {
                BidId = b.BidId,
                AuctionId = b.AuctionId,
                UserId = b.UserId,
                BidAmount = b.BidAmount,
                BidTime = b.BidTime
            }));
        }

        [HttpGet("user/{userId}/history")]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetUserBidHistory(int userId)
        {
            var bids = await _context.Bids
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();

            return Ok(bids.Select(b => new BidDto
            {
                BidId = b.BidId,
                AuctionId = b.AuctionId,
                UserId = b.UserId,
                BidAmount = b.BidAmount,
                BidTime = b.BidTime
            }));
        }

        [HttpGet("auction/{auctionId}/highest")]
        public async Task<ActionResult<BidDto>> GetHighestBid(int auctionId)
        {
            var bid = await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.BidTime)
                .FirstOrDefaultAsync();

            if (bid == null)
                return NotFound();

            return Ok(new BidDto
            {
                BidId = bid.BidId,
                AuctionId = bid.AuctionId,
                UserId = bid.UserId,
                BidAmount = bid.BidAmount,
                BidTime = bid.BidTime
            });
        }
    }
}
