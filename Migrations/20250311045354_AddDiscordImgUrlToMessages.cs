using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscordImgUrlToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiscordImgUrl",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(2962));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscordImgUrl" },
                values: new object[] { new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(5008), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DiscordImgUrl" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 3, 53, 797, DateTimeKind.Utc).AddTicks(5164), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DiscordImgUrl" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 13, 53, 797, DateTimeKind.Utc).AddTicks(5178), null });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(3471));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 10, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(3724));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(1746), new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(1831) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(2454));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$Pf7iz2zfZA7rZTGCQZmxae8GgMjzDQGBtRRbtWz28oqV4Ok0GJRiC");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordImgUrl",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(4502));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(6752));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 2, 3, 26, 381, DateTimeKind.Utc).AddTicks(6912));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 2, 13, 26, 381, DateTimeKind.Utc).AddTicks(6929));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(5152));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 7, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(5455));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(3299), new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(3386) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(4002));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$0m7UL8HoRoVA1ZzDAO.VZuoG7uQRoXSyO3aLIbXW8eSnTbtNIABQS");
        }
    }
}
