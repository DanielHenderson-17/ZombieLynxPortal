using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Data
{
    public class ZombieLynxPortalAPIDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public ZombieLynxPortalAPIDbContext(DbContextOptions<ZombieLynxPortalAPIDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<UserTicket> UserTickets { get; set; }
        public DbSet<AdminTicket> AdminTickets { get; set; }
        public DbSet<ZLGMember> ZLGMembers { get; set; }  // ✅ Added ZLGMember

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var adminPassword = _configuration["AdminPassword"] ?? "Zlg1717!";

            // ✅ Seed Admin User
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = adminId,
                Email = "admin@zombielynx.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                Role = "Admin"
            });

            // ✅ Seed Admin UserProfile
            modelBuilder.Entity<UserProfile>().HasData(new UserProfile
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "User",
                UserId = adminId
            });

            // ✅ Seed ZLGMember for Steam (Linked to Admin)
            modelBuilder.Entity<ZLGMember>().HasData(new ZLGMember
            {
                Id = 1,
                UserProfileId = 1,
                SteamId = "76561198021051512",
                SteamName = "AdminSteam",
                SteamImgUrl = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/adm/adminsteam.jpg",
                DiscordId = "123456789012345678",
                DiscordName = "AdminDiscord",
                DiscordImgUrl = "https://cdn.discordapp.com/avatars/123456789012345678/admin-discord.png",
                EosId = "eos-admin-id",
                EpicName = "AdminEpic",
                EpicImgUrl = "https://static.epicgames.com/admin-epic-avatar.png"
            });

            // ✅ Seed Ticket
            modelBuilder.Entity<Ticket>().HasData(new Ticket
            {
                Id = 1,
                Subject = "Test Ticket",
                Category = "Bug",
                Game = "Ark:SA",
                Server = "NA-East",
                Description = "Initial test ticket for the system.",
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserProfileId = 1
            });

            // ✅ Seed UserTicket
            modelBuilder.Entity<UserTicket>().HasData(new UserTicket
            {
                UserProfileId = 1,
                TicketId = 1,
                AssignedAt = DateTime.UtcNow
            });

            // ✅ Seed AdminTicket
            modelBuilder.Entity<AdminTicket>().HasData(new AdminTicket
            {
                AdminId = 1,
                TicketId = 1,
                AssignedAt = DateTime.UtcNow
            });

            // ✅ Composite Keys for Join Tables
            modelBuilder.Entity<UserTicket>()
                .HasKey(ut => new { ut.UserProfileId, ut.TicketId });

            modelBuilder.Entity<AdminTicket>()
                .HasKey(at => new { at.AdminId, at.TicketId });

            // ✅ Relationships for Tickets
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.UserProfile)
                .WithMany()
                .HasForeignKey(t => t.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserTicket>()
                .HasOne(ut => ut.UserProfile)
                .WithMany()
                .HasForeignKey(ut => ut.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserTicket>()
                .HasOne(ut => ut.Ticket)
                .WithMany(t => t.UserTickets)
                .HasForeignKey(ut => ut.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdminTicket>()
                .HasOne(at => at.Admin)
                .WithMany()
                .HasForeignKey(at => at.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdminTicket>()
                .HasOne(at => at.Ticket)
                .WithMany(t => t.AdminTickets)
                .HasForeignKey(at => at.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ ZLGMember Relationship
            modelBuilder.Entity<ZLGMember>()
                .HasOne(z => z.UserProfile)
                .WithMany()
                .HasForeignKey(z => z.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
