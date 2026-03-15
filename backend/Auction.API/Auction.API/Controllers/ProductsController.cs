using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Auction.API.Data;
using Auction.API.DTOs;
using Auction.API.Models;

namespace Auction.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
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
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                ActualPrice = p.ActualPrice,
                StartingPrice = p.StartingPrice,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            return Ok(new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                ActualPrice = product.ActualPrice,
                StartingPrice = product.StartingPrice,
                ImageUrl = product.ImageUrl,
                CreatedAt = product.CreatedAt
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto request)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can create products");

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                ActualPrice = request.ActualPrice,
                StartingPrice = request.StartingPrice,
                ImageUrl = request.ImageUrl
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId },
                new ProductDto
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    ActualPrice = product.ActualPrice,
                    StartingPrice = product.StartingPrice,
                    ImageUrl = product.ImageUrl,
                    CreatedAt = product.CreatedAt
                });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, CreateProductDto request)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can update products");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Name = request.Name;
            product.Description = request.Description;
            product.ActualPrice = request.ActualPrice;
            product.StartingPrice = request.StartingPrice;
            product.ImageUrl = request.ImageUrl;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetUserIdFromHeader();
            if (userId == 0 || !await IsAdminAsync(userId))
                return Forbid("Only admins can delete products");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
