using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Data
{
    public class ArkLinkPointsDbContext : DbContext
    {
        public ArkLinkPointsDbContext(DbContextOptions<ArkLinkPointsDbContext> options)
            : base(options) { }

        public DbSet<ArkShopPlayer> ArkShopPlayers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArkShopPlayer>()
                .ToTable("arkshopplayers");

            base.OnModelCreating(modelBuilder);
        }
    }
}
