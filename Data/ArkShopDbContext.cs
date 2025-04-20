using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Ark;

namespace ZombieLynxPortalAPI.Data
{
    public class ArkShopDbContext : DbContext
    {
        public ArkShopDbContext(DbContextOptions<ArkShopDbContext> options)
            : base(options)
        {
        }

        public DbSet<ArkPointsSyncEntry> PointsSyncQueue { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArkPointsSyncEntry>()
                .ToTable("pointsyncqueue");

            base.OnModelCreating(modelBuilder);
        }
    }
}
