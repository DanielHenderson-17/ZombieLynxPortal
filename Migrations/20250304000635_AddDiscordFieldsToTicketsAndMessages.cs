using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscordFieldsToTicketsAndMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DiscordChannelId",
                table: "Tickets",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscordUserId",
                table: "Messages",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiscordUserName",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 4, 0, 6, 34, 796, DateTimeKind.Utc).AddTicks(9976));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscordUserId", "DiscordUserName" },
                values: new object[] { new DateTime(2025, 3, 4, 0, 6, 34, 797, DateTimeKind.Utc).AddTicks(3699), null, null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DiscordUserId", "DiscordUserName" },
                values: new object[] { new DateTime(2025, 3, 4, 0, 16, 34, 797, DateTimeKind.Utc).AddTicks(3985), null, null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DiscordUserId", "DiscordUserName" },
                values: new object[] { new DateTime(2025, 3, 4, 0, 26, 34, 797, DateTimeKind.Utc).AddTicks(4022), null, null });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 4, 0, 6, 34, 797, DateTimeKind.Utc).AddTicks(1218));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 3, 0, 6, 34, 797, DateTimeKind.Utc).AddTicks(1705));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscordChannelId", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 4, 0, 6, 34, 796, DateTimeKind.Utc).AddTicks(8674), null, new DateTime(2025, 3, 4, 0, 6, 34, 796, DateTimeKind.Utc).AddTicks(8761) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 4, 0, 6, 34, 796, DateTimeKind.Utc).AddTicks(9453));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$3FGXawHnniMLyt2xMmPLtuXfqLVk49b17UP7TmNiGXCF7J.Zuc/dq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordChannelId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "DiscordUserId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DiscordUserName",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(1916));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(3871));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 22, 55, 0, 754, DateTimeKind.Utc).AddTicks(4040));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 23, 5, 0, 754, DateTimeKind.Utc).AddTicks(4051));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(2447));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 25, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(2700));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(702), new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(788) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 2, 26, 22, 45, 0, 754, DateTimeKind.Utc).AddTicks(1417));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$VMu.uTDwAJweqwUCr.STzewZWo6NDG/bHhj2Fz9v1bB6gtszyJ2W6");
        }
    }
}
