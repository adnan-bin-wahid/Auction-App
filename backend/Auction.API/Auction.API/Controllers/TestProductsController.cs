using Auction.API.Data;
using Auction.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestProduct>>> GetAll()
        {
            return await _context.TestProducts.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TestProduct>> Create(TestProduct product)
        {
            _context.TestProducts.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }
    }
}