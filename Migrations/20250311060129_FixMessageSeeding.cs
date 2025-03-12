using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixMessageSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(7847));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(9774), "[]" });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 11, 29, 496, DateTimeKind.Utc).AddTicks(9926), "[]" });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 21, 29, 496, DateTimeKind.Utc).AddTicks(9937), "[]" });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(8353));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 10, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(8602));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(6637), new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(6721) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(7353));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$Joyvp8plW/OhnWd3g.2ETOCZEnVU/CNhq1e7Yp60F7ingGcjjpfmy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 5, 50, 27, 906, DateTimeKind.Utc).AddTicks(1061));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 50, 27, 906, DateTimeKind.Utc).AddTicks(3073), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 0, 27, 906, DateTimeKind.Utc).AddTicks(3225), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImgUrlsJson" },
                values: new object[] { new DateTime(2025, 3, 11, 6, 10, 27, 906, DateTimeKind.Utc).AddTicks(3238), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 5, 50, 27, 906, DateTimeKind.Utc).AddTicks(1554));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 10, 5, 50, 27, 906, DateTimeKind.Utc).AddTicks(1799));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 50, 27, 905, DateTimeKind.Utc).AddTicks(9883), new DateTime(2025, 3, 11, 5, 50, 27, 905, DateTimeKind.Utc).AddTicks(9981) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 5, 50, 27, 906, DateTimeKind.Utc).AddTicks(580));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$MXzFJK3YfrpKDmMQi7AwbOI9nQOnRlZ7Mcjo/AOCw1teoI.Hzx.k6");
        }
    }
}
