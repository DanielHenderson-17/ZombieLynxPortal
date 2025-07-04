using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMinutesTrackingToBattlePassProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastMinutesPlayed",
                table: "BattlePassProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnprocessedMinutes",
                table: "BattlePassProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(7825));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 0, 25, 24, 432, DateTimeKind.Utc).AddTicks(190));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 0, 35, 24, 432, DateTimeKind.Utc).AddTicks(342));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 0, 45, 24, 432, DateTimeKind.Utc).AddTicks(356));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(8460));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 3, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(8717));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(6501), new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(6585) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(3181));

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 7, 4, 0, 25, 24, 431, DateTimeKind.Utc).AddTicks(7225));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$Go3WHE8BMg87EmI80PSkMu2l6HWcrT595Rgpfi4zaylpRzEWHx7ve");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMinutesPlayed",
                table: "BattlePassProgress");

            migrationBuilder.DropColumn(
                name: "UnprocessedMinutes",
                table: "BattlePassProgress");

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
        }
    }
}
