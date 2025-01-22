using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Message = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsGlobal = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Subject = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Game = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Server = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserProfileId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserNotifications",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(type: "integer", nullable: false),
                    NotificationId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserNotifications", x => new { x.UserProfileId, x.NotificationId });
                    table.ForeignKey(
                        name: "FK_UserNotifications_Notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserNotifications_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZLGMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SteamId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SteamName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SteamImgUrl = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    DiscordId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DiscordName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DiscordImgUrl = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    EosId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EpicName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EpicImgUrl = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    UserProfileId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZLGMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZLGMembers_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdminTickets",
                columns: table => new
                {
                    AdminId = table.Column<int>(type: "integer", nullable: false),
                    TicketId = table.Column<int>(type: "integer", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminTickets", x => new { x.AdminId, x.TicketId });
                    table.ForeignKey(
                        name: "FK_AdminTickets_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdminTickets_UserProfiles_AdminId",
                        column: x => x.AdminId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MessageGroupId = table.Column<int>(type: "integer", nullable: false),
                    UserProfileId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImgUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Tickets_MessageGroupId",
                        column: x => x.MessageGroupId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTickets",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(type: "integer", nullable: false),
                    TicketId = table.Column<int>(type: "integer", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTickets", x => new { x.UserProfileId, x.TicketId });
                    table.ForeignKey(
                        name: "FK_UserTickets_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTickets_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Notifications",
                columns: new[] { "Id", "CreatedAt", "Expiration", "IsGlobal", "Message" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(6942), null, true, "Welcome to Zombie Lynx Portal!" },
                    { 2, new DateTime(2025, 1, 21, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(7372), null, false, "New server update available." }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "Role" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "admin@zombielynx.com", "$2a$11$IfShfuwjz5GAtZHbhy/DueUfbFOEcgayHCn73ErU3QOPPmtLh3er6", "Admin" });

            migrationBuilder.InsertData(
                table: "UserProfiles",
                columns: new[] { "Id", "FirstName", "LastName", "UserId" },
                values: new object[] { 1, "Admin", "User", new Guid("11111111-1111-1111-1111-111111111111") });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "Game", "Server", "Status", "Subject", "UpdatedAt", "UserProfileId" },
                values: new object[] { 1, "Bug", new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(4182), "Initial test ticket for the system.", "Ark:SA", "NA-East", "Open", "Test Ticket", new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(4329), 1 });

            migrationBuilder.InsertData(
                table: "UserNotifications",
                columns: new[] { "NotificationId", "UserProfileId", "Id", "IsRead" },
                values: new object[,]
                {
                    { 1, 1, 1, false },
                    { 2, 1, 2, false }
                });

            migrationBuilder.InsertData(
                table: "ZLGMembers",
                columns: new[] { "Id", "DiscordId", "DiscordImgUrl", "DiscordName", "EosId", "EpicImgUrl", "EpicName", "SteamId", "SteamImgUrl", "SteamName", "UserProfileId" },
                values: new object[] { 1, "123456789012345678", "https://cdn.discordapp.com/avatars/123456789012345678/admin-discord.png", "AdminDiscord", "eos-admin-id", "https://static.epicgames.com/admin-epic-avatar.png", "AdminEpic", "76561198021051513", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/adm/adminsteam.jpg", "AdminSteam", 1 });

            migrationBuilder.InsertData(
                table: "AdminTickets",
                columns: new[] { "AdminId", "TicketId", "AssignedAt" },
                values: new object[] { 1, 1, new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(6115) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "CreatedAt", "ImgUrl", "MessageGroupId", "UserProfileId" },
                values: new object[,]
                {
                    { 1, "This is the first message in the ticket conversation.", new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(9266), null, 1, 1 },
                    { 2, "Following up on the issue. Any updates?", new DateTime(2025, 1, 22, 17, 27, 39, 22, DateTimeKind.Utc).AddTicks(9534), null, 1, 1 },
                    { 3, "Please let me know if you need more details.", new DateTime(2025, 1, 22, 17, 37, 39, 22, DateTimeKind.Utc).AddTicks(9549), null, 1, 1 }
                });

            migrationBuilder.InsertData(
                table: "UserTickets",
                columns: new[] { "TicketId", "UserProfileId", "AssignedAt" },
                values: new object[] { 1, 1, new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(5306) });

            migrationBuilder.CreateIndex(
                name: "IX_AdminTickets_TicketId",
                table: "AdminTickets",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MessageGroupId",
                table: "Messages",
                column: "MessageGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserProfileId",
                table: "Messages",
                column: "UserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UserProfileId",
                table: "Tickets",
                column: "UserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_NotificationId",
                table: "UserNotifications",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTickets_TicketId",
                table: "UserTickets",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_ZLGMembers_UserProfileId",
                table: "ZLGMembers",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminTickets");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "UserNotifications");

            migrationBuilder.DropTable(
                name: "UserTickets");

            migrationBuilder.DropTable(
                name: "ZLGMembers");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
