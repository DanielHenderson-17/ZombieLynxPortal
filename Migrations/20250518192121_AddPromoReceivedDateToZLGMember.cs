using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPromoReceivedDateToZLGMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PromoReceivedDate",
                table: "ZLGMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(7281));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(9955));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 31, 21, 12, DateTimeKind.Utc).AddTicks(109));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 41, 21, 12, DateTimeKind.Utc).AddTicks(122));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(7909));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 17, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(8202));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6047), new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6134) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6776));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$f9MejwdRspLB6Ppg5dOsAuQwPDNIMFvOWJq9diI.ChK0xHxZF0fNm");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PromoReceivedDate",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PromoReceivedDate",
                table: "ZLGMembers");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(6570));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(9018));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 15, 15, 1, 50, 441, DateTimeKind.Utc).AddTicks(9164));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 15, 15, 11, 50, 441, DateTimeKind.Utc).AddTicks(9178));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(7311));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 14, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(7683));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(5326), new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(5405) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 15, 14, 51, 50, 441, DateTimeKind.Utc).AddTicks(6016));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$Ll1PcLlbstd7oj68RuK.neTTCodplWvNy2cp7WxZQmeIQiUaORG5W");
        }
    }
}
