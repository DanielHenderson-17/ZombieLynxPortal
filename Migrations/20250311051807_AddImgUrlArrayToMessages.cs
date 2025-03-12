using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImgUrlArrayToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "Messages");

            migrationBuilder.AddColumn<List<string>>(
                name: "ImgUrls",
                table: "Messages",
                type: "text[]",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(3788));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImgUrls" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(7003), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImgUrls" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 28, 7, 447, DateTimeKind.Utc).AddTicks(7276), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImgUrls" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 38, 7, 447, DateTimeKind.Utc).AddTicks(7293), new List<string>() });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(4588));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 10, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(5014));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(1807), new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(1948) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 11, 5, 18, 7, 447, DateTimeKind.Utc).AddTicks(3002));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$eqNF1Y.v3EqxRJM92Koz6ePXtgbB/20vPEcvEup1M9rINordVFie.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImgUrls",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
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
                columns: new[] { "CreatedAt", "ImgUrl" },
                values: new object[] { new DateTime(2025, 3, 11, 4, 53, 53, 797, DateTimeKind.Utc).AddTicks(5008), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImgUrl" },
                values: new object[] { new DateTime(2025, 3, 11, 5, 3, 53, 797, DateTimeKind.Utc).AddTicks(5164), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImgUrl" },
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
    }
}
