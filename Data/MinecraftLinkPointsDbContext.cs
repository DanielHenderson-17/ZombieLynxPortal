using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Minecraft;

namespace ZombieLynxPortalAPI.Data
{
    public class MinecraftLinkPointsDbContext : DbContext
    {
        public MinecraftLinkPointsDbContext(DbContextOptions<MinecraftLinkPointsDbContext> options)
            : base(options) { }

        public DbSet<MinecraftCoinsUser> CoinsEngineUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MinecraftCoinsUser>()
                .ToTable("coinsengine_users");

            base.OnModelCreating(modelBuilder);
        }
    }
}
