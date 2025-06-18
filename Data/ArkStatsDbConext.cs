using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Data
{
    public class ArkStatsDbContext : DbContext
    {
        public ArkStatsDbContext(DbContextOptions<ArkStatsDbContext> options)
            : base(options) { }

        public DbSet<ArkStats> ArkStats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArkStats>().ToTable("statsyncqueue");

            base.OnModelCreating(modelBuilder);
        }
    }
}
