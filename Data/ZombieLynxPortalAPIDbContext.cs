using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Data
{
    public class ZombieLynxPortalAPIDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        // ✅ Single Constructor with IConfiguration
        public ZombieLynxPortalAPIDbContext(DbContextOptions<ZombieLynxPortalAPIDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var adminId = Guid.NewGuid();  // Ensure consistency across seeding
            var adminPassword = _configuration["AdminPassword"] ?? "Zlg1717!";

            // ✅ Seed Admin User
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = adminId,
                Email = "admin@zombielynx.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                Role = "Admin"
            });

            // ✅ Seed Admin Profile
            modelBuilder.Entity<UserProfile>().HasData(new UserProfile
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "User",
                UserId = adminId
            });
        }
    }
}
