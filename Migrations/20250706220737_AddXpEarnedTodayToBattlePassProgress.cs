using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddXpEarnedTodayToBattlePassProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "XpEarnedToday",
                table: "BattlePassProgress",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(9065));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 6, 22, 7, 37, 191, DateTimeKind.Utc).AddTicks(1326));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 6, 22, 17, 37, 191, DateTimeKind.Utc).AddTicks(1488));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 6, 22, 27, 37, 191, DateTimeKind.Utc).AddTicks(1501));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(9685));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 5, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(9956));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(7571), new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(7662) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(4024));

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 7, 6, 22, 7, 37, 190, DateTimeKind.Utc).AddTicks(8476));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$QLFLXSDW/Dib83IHI4c54./7tlFOh09KqsC2xHANAna1kMVHBJz8O");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "XpEarnedToday",
                table: "BattlePassProgress");

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
    }
}
