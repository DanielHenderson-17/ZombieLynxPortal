using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Ark;

namespace ZombieLynxPortalAPI.Data
{
    public class AsaPermissionsDbContext : DbContext
    {
        public AsaPermissionsDbContext(DbContextOptions<AsaPermissionsDbContext> options) : base(options) { }

        public DbSet<AsaPermissionPlayer> Players { get; set; }
    }
}
