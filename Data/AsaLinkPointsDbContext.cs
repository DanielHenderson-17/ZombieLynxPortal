using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Data.Ark
{
    public class AsaLinkPointsDbContext : DbContext
    {
        public AsaLinkPointsDbContext(DbContextOptions<AsaLinkPointsDbContext> options)
            : base(options) { }

        public DbSet<AsaShopPlayer> AsaShopPlayers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AsaShopPlayer>()
                .ToTable("arkshopplayers");

            base.OnModelCreating(modelBuilder);
        }
    }
}
