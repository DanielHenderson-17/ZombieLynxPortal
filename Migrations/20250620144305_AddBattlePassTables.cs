using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBattlePassTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BattlePassClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ZLGMemberId = table.Column<int>(type: "integer", nullable: false),
                    LevelNumber = table.Column<int>(type: "integer", nullable: false),
                    ClaimedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattlePassClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BattlePassClaims_ZLGMembers_ZLGMemberId",
                        column: x => x.ZLGMemberId,
                        principalTable: "ZLGMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BattlePassProgress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ZLGMemberId = table.Column<int>(type: "integer", nullable: false),
                    XP = table.Column<int>(type: "integer", nullable: false),
                    HasPremium = table.Column<bool>(type: "boolean", nullable: false),
                    PremiumPurchasedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastXPUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattlePassProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BattlePassProgress_ZLGMembers_ZLGMemberId",
                        column: x => x.ZLGMemberId,
                        principalTable: "ZLGMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(3266));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(5526));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 20, 14, 53, 5, 432, DateTimeKind.Utc).AddTicks(5678));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 20, 15, 3, 5, 432, DateTimeKind.Utc).AddTicks(5690));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(3889));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 19, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(4212));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(1922), new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(2006) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 20, 14, 43, 5, 431, DateTimeKind.Utc).AddTicks(8543));

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 6, 20, 14, 43, 5, 432, DateTimeKind.Utc).AddTicks(2680));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$gd2L1reVsxM3UgDxKsuzHOl8ndbRqcUrwfzyIJ0g.ROwPHG8gM3ZK");

            migrationBuilder.CreateIndex(
                name: "IX_BattlePassClaims_ZLGMemberId_LevelNumber",
                table: "BattlePassClaims",
                columns: new[] { "ZLGMemberId", "LevelNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BattlePassProgress_ZLGMemberId",
                table: "BattlePassProgress",
                column: "ZLGMemberId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BattlePassClaims");

            migrationBuilder.DropTable(
                name: "BattlePassProgress");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(8498));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 4, 22, 53, 12, 329, DateTimeKind.Utc).AddTicks(954));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 4, 23, 3, 12, 329, DateTimeKind.Utc).AddTicks(1111));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 4, 23, 13, 12, 329, DateTimeKind.Utc).AddTicks(1125));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(9095));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 3, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(9354));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(7197), new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(7282) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(3957));

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 6, 4, 22, 53, 12, 328, DateTimeKind.Utc).AddTicks(7958));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$a/zOFLEsdUzQhG58wxh.seE2bNVAttboiyAeAZRsGN.oWlrHfvCHq");
        }
    }
}
