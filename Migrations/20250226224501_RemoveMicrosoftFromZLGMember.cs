using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMicrosoftFromZLGMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MicrosoftId",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "MicrosoftImgUrl",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "MicrosoftName",
                table: "ZLGMembers");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MicrosoftId",
                table: "ZLGMembers",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MicrosoftImgUrl",
                table: "ZLGMembers",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MicrosoftName",
                table: "ZLGMembers",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(6561));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(8585));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 14, 31, 50, 139, DateTimeKind.Utc).AddTicks(8748));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 14, 41, 50, 139, DateTimeKind.Utc).AddTicks(8775));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(7081));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 25, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(7339));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(5399), new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(5483) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 2, 26, 14, 21, 50, 139, DateTimeKind.Utc).AddTicks(6087));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$94GZdoGcDsrm9SOP4x3xIO.VLQmv29Mo8JFqGZEK1108Aiy37YQ6a");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "MicrosoftId", "MicrosoftImgUrl", "MicrosoftName" },
                values: new object[] { null, null, null });
        }
    }
}
