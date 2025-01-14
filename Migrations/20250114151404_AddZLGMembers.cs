using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddZLGMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 15, 14, 4, 77, DateTimeKind.Utc).AddTicks(875));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 14, 15, 14, 4, 76, DateTimeKind.Utc).AddTicks(9687), new DateTime(2025, 1, 14, 15, 14, 4, 76, DateTimeKind.Utc).AddTicks(9773) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 15, 14, 4, 77, DateTimeKind.Utc).AddTicks(371));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$g2ZekxmGvhZj9VwsVSzsH.WIZvo6dSNvBLzfOQw7MakTZ8ny5hCdi");

            migrationBuilder.InsertData(
                table: "ZLGMembers",
                columns: new[] { "Id", "DiscordId", "DiscordImgUrl", "DiscordName", "EosId", "EpicImgUrl", "EpicName", "SteamId", "SteamImgUrl", "SteamName", "UserProfileId" },
                values: new object[] { 1, "123456789012345678", "https://cdn.discordapp.com/avatars/123456789012345678/admin-discord.png", "AdminDiscord", "eos-admin-id", "https://static.epicgames.com/admin-epic-avatar.png", "AdminEpic", "76561198021051512", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/adm/adminsteam.jpg", "AdminSteam", 1 });

            migrationBuilder.CreateIndex(
                name: "IX_ZLGMembers_UserProfileId",
                table: "ZLGMembers",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZLGMembers");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 1, 26, 59, 765, DateTimeKind.Utc).AddTicks(6050));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 14, 1, 26, 59, 765, DateTimeKind.Utc).AddTicks(4791), new DateTime(2025, 1, 14, 1, 26, 59, 765, DateTimeKind.Utc).AddTicks(4884) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 1, 26, 59, 765, DateTimeKind.Utc).AddTicks(5531));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$aVpsppXfn9yBA8Dxed1PlOgek8cyWOF8RoBNYwCaOZJwo5aOl5fAO");
        }
    }
}
