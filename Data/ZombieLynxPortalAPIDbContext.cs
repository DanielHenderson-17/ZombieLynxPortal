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
        public DbSet<ZLGMember> ZLGMembers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<UserNotification> UserNotifications { get; set; }
        public DbSet<TebexBasket> TebexBaskets { get; set; }
        public DbSet<EmailVerification> EmailVerifications { get; set; }
        public DbSet<PreviouslyLinkedAccount> PreviouslyLinkedAccounts { get; set; }
        public DbSet<PasswordReset> PasswordResets { get; set; }
        public DbSet<ProcessedTransaction> ProcessedTransactions { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<VoteResult> VoteResults { get; set; }
        public DbSet<BattlePassProgress> BattlePassProgress { get; set; }
        public DbSet<BattlePassClaim> BattlePassClaims { get; set; }

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
                SteamId = "76561198021051513",
                SteamName = "AdminSteam",
                SteamImgUrl = null,
                DiscordId = "1167715864339030015",
                DiscordName = "AdminDiscord",
                DiscordImgUrl = "https://picsum.photos/seed/100/40/40",
                EosId = "eos-admin-id",
                EpicName = "AdminEpic",
                EpicImgUrl = null,
                MinecraftUuid = "550e8400-e29b-41d4-a716-446655440000",
                MinecraftUsername = "AdminMinecraft",
                MinecraftAvatarUrl = "https://crafatar.com/avatars/550e8400-e29b-41d4-a716-446655440000",
                PermissionGroups = "Default,Admins",
                TimedPermissionGroups = null,
                Points = 0,
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

            // Seed Notifications
            modelBuilder.Entity<Notification>().HasData(
                new Notification
                {
                    Id = 1,
                    Subject = "Welcome!",
                    Message = "Welcome to Zombie Lynx Portal!",
                    CreatedAt = DateTime.UtcNow,
                    IsGlobal = true,
                    Expiration = null
                },
                new Notification
                {
                    Id = 2,
                    Subject = "Server Update",
                    Message = "New server update available.",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    IsGlobal = false
                }
            );

            // Seed UserNotifications
            modelBuilder.Entity<UserNotification>().HasData(
                new UserNotification
                {
                    Id = 1,
                    UserProfileId = 1,
                    NotificationId = 1,
                    IsRead = false
                },
                new UserNotification
                {
                    Id = 2,
                    UserProfileId = 1,
                    NotificationId = 2,
                    IsRead = false
                }
            );

            // Seed Message
            modelBuilder.Entity<Message>().HasData(
                new Message
                {
                    Id = 1,
                    MessageGroupId = 1,
                    UserProfileId = 1,
                    Content = "This is the first message in the ticket conversation.",
                    CreatedAt = DateTime.UtcNow,
                    ImgUrlsJson = "[]"
                },
                new Message
                {
                    Id = 2,
                    MessageGroupId = 1,
                    UserProfileId = 1,
                    Content = "Following up on the issue. Any updates?",
                    CreatedAt = DateTime.UtcNow.AddMinutes(10),
                    ImgUrlsJson = "[]"
                },
                new Message
                {
                    Id = 3,
                    MessageGroupId = 1,
                    UserProfileId = 1,
                    Content = "Please let me know if you need more details.",
                    CreatedAt = DateTime.UtcNow.AddMinutes(20),
                    ImgUrlsJson = "[]"
                }
            );

            // ✅ Default Value for AllowMarketingEmails
            modelBuilder.Entity<UserProfile>()
                .Property(up => up.AllowMarketingEmails)
                .HasDefaultValue(true);

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
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            // ✅ Relationships for EmailVerifications
            modelBuilder.Entity<EmailVerification>()
                .HasOne(ev => ev.User)
                .WithMany()
                .HasForeignKey(ev => ev.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Relationships for ZLGMembers
            modelBuilder.Entity<ZLGMember>()
                .Property(z => z.MinecraftLinked)
                .HasDefaultValue(false);

            modelBuilder.Entity<ZLGMember>()
                .Property(z => z.ASELinked)
                .HasDefaultValue(false);

            modelBuilder.Entity<ZLGMember>()
                .Property(z => z.ASALinked)
                .HasDefaultValue(false);

            modelBuilder.Entity<ZLGMember>()
                .Property(z => z.RustLinked)
                .HasDefaultValue(false);

            // ✅ Relationships for UserTickets
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

            // ✅ Relationships for AdminTickets
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

            // ✅ Message Relationship
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Ticket)
                .WithMany(t => t.Messages)
                .HasForeignKey(m => m.MessageGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.UserProfile)
                .WithMany()
                .HasForeignKey(m => m.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Notification Configuration
            modelBuilder.Entity<Notification>()
                .Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Notification>()
                .Property(n => n.IsGlobal)
                .IsRequired();

            modelBuilder.Entity<Notification>()
                .Property(n => n.CreatedAt)
                .IsRequired();

            // ✅ UserNotification Configuration
            modelBuilder.Entity<UserNotification>()
                .HasKey(un => new { un.UserProfileId, un.NotificationId });

            modelBuilder.Entity<UserNotification>()
                .HasOne(un => un.UserProfile)
                .WithMany()
                .HasForeignKey(un => un.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserNotification>()
                .HasOne(un => un.Notification)
                .WithMany()
                .HasForeignKey(un => un.NotificationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TebexBasket>()
                .HasOne(tb => tb.UserProfile)
                .WithMany()
                .HasForeignKey(tb => tb.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PreviouslyLinkedAccount>()
                .HasIndex(p => new { p.Platform, p.ExternalId })
                .IsUnique();

            modelBuilder.Entity<PasswordReset>()
                .HasOne(pr => pr.User)
                .WithMany()
                .HasForeignKey(pr => pr.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Vote>()
                .HasOne(v => v.Game)
                .WithMany()
                .HasForeignKey(v => v.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VoteResult>()
                .HasOne(vr => vr.Vote)
                .WithMany()
                .HasForeignKey(vr => vr.VoteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VoteResult>()
                .HasOne(vr => vr.ZLGMember)
                .WithMany()
                .HasForeignKey(vr => vr.ZLGMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Battle Pass Progress Relationship
            modelBuilder.Entity<BattlePassProgress>()
                .HasOne(p => p.ZLGMember)
                .WithMany()
                .HasForeignKey(p => p.ZLGMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Battle Pass Claim Relationship
            modelBuilder.Entity<BattlePassClaim>()
                .HasOne(c => c.ZLGMember)
                .WithMany()
                .HasForeignKey(c => c.ZLGMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Unique constraint: 1 progress per ZLGMember
            modelBuilder.Entity<BattlePassProgress>()
                .HasIndex(p => p.ZLGMemberId)
                .IsUnique();

            // ✅ Unique constraint: 1 claim per level per ZLGMember
            modelBuilder.Entity<BattlePassClaim>()
                .HasIndex(c => new { c.ZLGMemberId, c.LevelNumber })
                .IsUnique();
        }
    }
}
