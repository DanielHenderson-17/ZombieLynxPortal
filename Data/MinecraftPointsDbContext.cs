using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Data
{
    public class MinecraftPointsDbContext : DbContext
    {
        public MinecraftPointsDbContext(DbContextOptions<MinecraftPointsDbContext> options) : base(options) { }

        public DbSet<MinecraftCoinsUser> CoinsEngineUsers { get; set; }
    }
}
