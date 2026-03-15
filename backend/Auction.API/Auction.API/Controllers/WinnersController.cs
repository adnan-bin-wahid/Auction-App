using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Auction.API.Data;
using Auction.API.Models;

namespace Auction.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WinnersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WinnersController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<bool> IsAdminAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.Role == "Admin";
        }

        private int GetUserIdFromHeader()
        {
            if (Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) && int.TryParse(userIdHeader, out var userId))
            {
                return userId;
            }
            return 0;
        }

        [HttpPost("assign-winner/{auctionId}")]
        public async Task<ActionResult> AssignWinner(int auctionId)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can assign winners");

            var auction = await _context.Auctions.FindAsync(auctionId);
            if (auction == null)
                return NotFound("Auction not found");

            // Check if auction is ended
            if (auction.Status != "Closed" && auction.Status != "Ended")
                return BadRequest("Auction must be ended before assigning a winner");

            // Check if winner already assigned
            if (await _context.AuctionWinners.AnyAsync(w => w.AuctionId == auctionId))
                return BadRequest("Winner already assigned for this auction");

            // Get the highest bid (or earliest if tied)
            var winningBid = await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.BidTime)
                .FirstOrDefaultAsync();

            if (winningBid == null)
                return BadRequest("No bids found for this auction");

            var winner = new AuctionWinner
            {
                AuctionId = auctionId,
                UserId = winningBid.UserId,
                BidId = winningBid.BidId,
                WinningAmount = winningBid.BidAmount
            };

            _context.AuctionWinners.Add(winner);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                WinnerId = winner.WinnerId,
                AuctionId = winner.AuctionId,
                UserId = winner.UserId,
                BidId = winner.BidId,
                WinningAmount = winner.WinningAmount,
                AssignedAt = winner.AssignedAt
            });
        }

        [HttpGet("auction/{auctionId}")]
        public async Task<ActionResult> GetWinnerByAuction(int auctionId)
        {
            var winner = await _context.AuctionWinners
                .Include(w => w.User)
                .Include(w => w.Auction)
                .ThenInclude(a => a.Product)
                .FirstOrDefaultAsync(w => w.AuctionId == auctionId);

            if (winner == null)
                return NotFound();

            return Ok(new
            {
                winner.WinnerId,
                winner.AuctionId,
                winner.UserId,
                UserName = winner.User.Name,
                winner.BidId,
                winner.WinningAmount,
                winner.AssignedAt,
                Product = new
                {
                    winner.Auction.Product.ProductId,
                    winner.Auction.Product.Name
                }
            });
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetWinnersByUser(int userId)
        {
            var winners = await _context.AuctionWinners
                .Where(w => w.UserId == userId)
                .Include(w => w.Auction)
                .ThenInclude(a => a.Product)
                .ToListAsync();

            return Ok(winners.Select(w => new
            {
                w.WinnerId,
                w.AuctionId,
                w.UserId,
                w.BidId,
                w.WinningAmount,
                w.AssignedAt,
                Product = new
                {
                    w.Auction.Product.ProductId,
                    w.Auction.Product.Name
                }
            }));
        }

        [HttpDelete("{winnerId}")]
        public async Task<IActionResult> DeleteWinner(int winnerId)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can delete winners");

            var winner = await _context.AuctionWinners.FindAsync(winnerId);
            if (winner == null)
                return NotFound();

            _context.AuctionWinners.Remove(winner);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
