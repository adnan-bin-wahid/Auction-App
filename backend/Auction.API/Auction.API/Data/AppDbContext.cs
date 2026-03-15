using Microsoft.EntityFrameworkCore;
using Auction.API.Models;
using AuctionModel = Auction.API.Models.Auction;

namespace Auction.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<AuctionModel> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<AuctionWinner> AuctionWinners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>()
                .HasKey(u => u.UserId);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure Product entity
            modelBuilder.Entity<Product>()
                .HasKey(p => p.ProductId);

            // Configure Auction entity
            modelBuilder.Entity<AuctionModel>()
                .HasKey(a => a.AuctionId);
            modelBuilder.Entity<AuctionModel>()
                .HasOne(a => a.Product)
                .WithMany(p => p.Auctions)
                .HasForeignKey(a => a.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Bid entity
            modelBuilder.Entity<Bid>()
                .HasKey(b => b.BidId);
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Auction)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure AuctionWinner entity
            modelBuilder.Entity<AuctionWinner>()
                .HasKey(w => w.WinnerId);
            modelBuilder.Entity<AuctionWinner>()
                .HasOne(w => w.Auction)
                .WithOne(a => a.Winner)
                .HasForeignKey<AuctionWinner>(w => w.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<AuctionWinner>()
                .HasOne(w => w.User)
                .WithMany(u => u.WonAuctions)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<AuctionWinner>()
                .HasOne(w => w.Bid)
                .WithMany()
                .HasForeignKey(w => w.BidId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}