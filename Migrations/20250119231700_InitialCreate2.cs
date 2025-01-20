using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ZLGMembers_UserProfiles_UserProfileId1",
                table: "ZLGMembers");

            migrationBuilder.DropIndex(
                name: "IX_ZLGMembers_UserProfileId1",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "UserProfileId1",
                table: "ZLGMembers");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 19, 23, 16, 59, 927, DateTimeKind.Utc).AddTicks(1542));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 16, 59, 927, DateTimeKind.Utc).AddTicks(2237));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 26, 59, 927, DateTimeKind.Utc).AddTicks(2397));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 36, 59, 927, DateTimeKind.Utc).AddTicks(2464));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 19, 23, 16, 59, 927, DateTimeKind.Utc).AddTicks(272), new DateTime(2025, 1, 19, 23, 16, 59, 927, DateTimeKind.Utc).AddTicks(357) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 19, 23, 16, 59, 927, DateTimeKind.Utc).AddTicks(976));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$JhdQJu6gjHSUtBnfylE4qetIw1RdRrK07bKxdmb8SXM5VFU5qwQjS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserProfileId1",
                table: "ZLGMembers",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 19, 23, 10, 15, 982, DateTimeKind.Utc).AddTicks(2026));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 10, 15, 982, DateTimeKind.Utc).AddTicks(2746));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 20, 15, 982, DateTimeKind.Utc).AddTicks(2928));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 19, 23, 30, 15, 982, DateTimeKind.Utc).AddTicks(3000));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 19, 23, 10, 15, 982, DateTimeKind.Utc).AddTicks(438), new DateTime(2025, 1, 19, 23, 10, 15, 982, DateTimeKind.Utc).AddTicks(540) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 19, 23, 10, 15, 982, DateTimeKind.Utc).AddTicks(1402));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$akddPUcGExwpGhim36zqOeyt4CxyolGuoi7W5jyP9TKa9c4d1zPxm");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                column: "UserProfileId1",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_ZLGMembers_UserProfileId1",
                table: "ZLGMembers",
                column: "UserProfileId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ZLGMembers_UserProfiles_UserProfileId1",
                table: "ZLGMembers",
                column: "UserProfileId1",
                principalTable: "UserProfiles",
                principalColumn: "Id");
        }
    }
}
