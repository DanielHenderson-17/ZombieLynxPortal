using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSubjectFieldToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Notifications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 27, 20, 11, 3, 192, DateTimeKind.Utc).AddTicks(9818));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 27, 20, 11, 3, 193, DateTimeKind.Utc).AddTicks(2139));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 27, 20, 21, 3, 193, DateTimeKind.Utc).AddTicks(2289));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 27, 20, 31, 3, 193, DateTimeKind.Utc).AddTicks(2303));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Subject" },
                values: new object[] { new DateTime(2025, 4, 27, 20, 11, 3, 193, DateTimeKind.Utc).AddTicks(428), "Welcome!" });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Subject" },
                values: new object[] { new DateTime(2025, 4, 26, 20, 11, 3, 193, DateTimeKind.Utc).AddTicks(681), "Server Update" });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 27, 20, 11, 3, 192, DateTimeKind.Utc).AddTicks(8637), new DateTime(2025, 4, 27, 20, 11, 3, 192, DateTimeKind.Utc).AddTicks(8720) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 27, 20, 11, 3, 192, DateTimeKind.Utc).AddTicks(9316));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$wUrw.m2FV2xPx21UKruxM.Xw5XTJRQ8nIj/Kn6TdXTCN9I6K0KDu6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Notifications");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(7404));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(9581));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 26, 21, 37, 12, 532, DateTimeKind.Utc).AddTicks(9734));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 26, 21, 47, 12, 532, DateTimeKind.Utc).AddTicks(9748));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(7941));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 25, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(8184));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(6167), new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(6251) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 26, 21, 27, 12, 532, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$F1VGaTXcIVUZK2VM5498guQs69AICxUIDVAGGudQVMd0q.zs4.F5W");
        }
    }
}
