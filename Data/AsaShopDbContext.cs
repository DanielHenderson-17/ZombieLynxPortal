using Microsoft.EntityFrameworkCore;

namespace ZombieLynxPortalAPI.Data
{
    public class AsaShopDbContext : DbContext
    {
        public AsaShopDbContext(DbContextOptions<AsaShopDbContext> options) : base(options) { }

        public DbSet<AsaShopPlayer> AsaShopPlayers { get; set; }
    }
}
