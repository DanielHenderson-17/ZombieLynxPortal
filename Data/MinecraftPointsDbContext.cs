using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Minecraft;

namespace ZombieLynxPortalAPI.Data
{
    public class MinecraftPointsDbContext : DbContext
    {
        public MinecraftPointsDbContext(DbContextOptions<MinecraftPointsDbContext> options) : base(options) { }

        public DbSet<MinecraftCoinsUser> CoinsEngineUsers { get; set; }

        public DbSet<MinecraftPointsSyncEntry> PointsSyncQueue { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MinecraftPointsSyncEntry>()
                .ToTable("pointsyncqueue");

            base.OnModelCreating(modelBuilder);
        }
    }
}
