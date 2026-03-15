using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Auction.API.Data;
using Auction.API.DTOs;
using Auction.API.Models;
using AuctionModel = Auction.API.Models.Auction;

namespace Auction.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuctionsController(AppDbContext context)
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _context.Auctions
                .Include(a => a.Product)
                .ToListAsync();

            return Ok(auctions.Select(a => new AuctionDto
            {
                AuctionId = a.AuctionId,
                ProductId = a.ProductId,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status,
                Product = new ProductDto
                {
                    ProductId = a.Product.ProductId,
                    Name = a.Product.Name,
                    Description = a.Product.Description,
                    ActualPrice = a.Product.ActualPrice,
                    StartingPrice = a.Product.StartingPrice,
                    ImageUrl = a.Product.ImageUrl,
                    CreatedAt = a.Product.CreatedAt
                }
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(int id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Product)
                .FirstOrDefaultAsync(a => a.AuctionId == id);

            if (auction == null)
                return NotFound();

            return Ok(new AuctionDto
            {
                AuctionId = auction.AuctionId,
                ProductId = auction.ProductId,
                StartTime = auction.StartTime,
                EndTime = auction.EndTime,
                Status = auction.Status,
                Product = new ProductDto
                {
                    ProductId = auction.Product.ProductId,
                    Name = auction.Product.Name,
                    Description = auction.Product.Description,
                    ActualPrice = auction.Product.ActualPrice,
                    StartingPrice = auction.Product.StartingPrice,
                    ImageUrl = auction.Product.ImageUrl,
                    CreatedAt = auction.Product.CreatedAt
                }
            });
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionByProductId(int productId)
        {
            var auction = await _context.Auctions
                .Include(a => a.Product)
                .FirstOrDefaultAsync(a => a.ProductId == productId);

            if (auction == null)
                return NotFound();

            return Ok(new AuctionDto
            {
                AuctionId = auction.AuctionId,
                ProductId = auction.ProductId,
                StartTime = auction.StartTime,
                EndTime = auction.EndTime,
                Status = auction.Status,
                Product = new ProductDto
                {
                    ProductId = auction.Product.ProductId,
                    Name = auction.Product.Name,
                    Description = auction.Product.Description,
                    ActualPrice = auction.Product.ActualPrice,
                    StartingPrice = auction.Product.StartingPrice,
                    ImageUrl = auction.Product.ImageUrl,
                    CreatedAt = auction.Product.CreatedAt
                }
            });
        }

        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto request)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can create auctions");

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                return BadRequest("Product not found");

            var auction = new AuctionModel
            {
                ProductId = request.ProductId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Status = "Active"
            };

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuctionById), new { id = auction.AuctionId },
                new AuctionDto
                {
                    AuctionId = auction.AuctionId,
                    ProductId = auction.ProductId,
                    StartTime = auction.StartTime,
                    EndTime = auction.EndTime,
                    Status = auction.Status,
                    Product = new ProductDto
                    {
                        ProductId = product.ProductId,
                        Name = product.Name,
                        Description = product.Description,
                        ActualPrice = product.ActualPrice,
                        StartingPrice = product.StartingPrice,
                        ImageUrl = product.ImageUrl,
                        CreatedAt = product.CreatedAt
                    }
                });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateAuctionStatus(int id, [FromBody] string status)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can update auction status");

            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null)
                return NotFound();

            auction.Status = status;
            _context.Auctions.Update(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/active")]
        public async Task<ActionResult<bool>> IsAuctionActive(int id)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null)
                return NotFound();

            bool isActive = auction.Status == "Active" && 
                           DateTime.UtcNow >= auction.StartTime && 
                           DateTime.UtcNow <= auction.EndTime;

            return Ok(isActive);
        }
    }
}
