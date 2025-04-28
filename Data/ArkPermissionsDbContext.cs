using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Ark;

namespace ZombieLynxPortalAPI.Data
{
    public class ArkPermissionsDbContext : DbContext
    {
        public ArkPermissionsDbContext(DbContextOptions<ArkPermissionsDbContext> options) : base(options) { }

        public DbSet<ArkPermissionPlayer> Players { get; set; }
    }
}
