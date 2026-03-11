using Microsoft.EntityFrameworkCore;
using Auction.API.Models;

namespace Auction.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TestProduct> TestProducts { get; set; }
    }
}