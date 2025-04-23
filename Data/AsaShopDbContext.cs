using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Ark;

namespace ZombieLynxPortalAPI.Data
{
    public class AsaShopDbContext : DbContext
    {
        public AsaShopDbContext(DbContextOptions<AsaShopDbContext> options) : base(options) { }

        public DbSet<AsaShopPlayer> AsaShopPlayers { get; set; }

        public DbSet<AsaPointsSyncEntry> PointsSyncQueue { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AsaPointsSyncEntry>()
                .ToTable("pointsyncqueue");

            base.OnModelCreating(modelBuilder);
        }
    }
}
