using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models.Minecraft;

namespace ZombieLynxPortalAPI.Data
{
    public class MinecraftPermissionsDbContext : DbContext
    {
        public MinecraftPermissionsDbContext(DbContextOptions<MinecraftPermissionsDbContext> options) : base(options) { }

        public DbSet<MinecraftPermissionPlayer> Permissions { get; set; }
    }
}
