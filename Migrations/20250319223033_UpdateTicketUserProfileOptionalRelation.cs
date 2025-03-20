using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketUserProfileOptionalRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_UserProfiles_UserProfileId",
                table: "Tickets");

            migrationBuilder.AlterColumn<int>(
                name: "UserProfileId",
                table: "Tickets",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(1818));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(3898));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 19, 22, 40, 33, 285, DateTimeKind.Utc).AddTicks(4057));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 19, 22, 50, 33, 285, DateTimeKind.Utc).AddTicks(4069));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(2355));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 18, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(2613));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(565), new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(654) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 19, 22, 30, 33, 285, DateTimeKind.Utc).AddTicks(1308));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$0ZbgAF20sDf/zRQghn.EgupY4d1H2hrh2AE6bUAT/iokDOcpGU5LO");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordId", "DiscordImgUrl", "DiscordName" },
                values: new object[] { "1167715864339030016", "https://cdn.discordapp.com/avatars/1167715864339030016/a9e52c811d7724ba08fbba1c4e30154d.png", "zombielynxgaming" });

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_UserProfiles_UserProfileId",
                table: "Tickets",
                column: "UserProfileId",
                principalTable: "UserProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_UserProfiles_UserProfileId",
                table: "Tickets");

            migrationBuilder.AlterColumn<int>(
                name: "UserProfileId",
                table: "Tickets",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 6, 1, 29, 496, DateTimeKind.Utc).AddTicks(9774));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 6, 11, 29, 496, DateTimeKind.Utc).AddTicks(9926));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 11, 6, 21, 29, 496, DateTimeKind.Utc).AddTicks(9937));

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

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordId", "DiscordImgUrl", "DiscordName" },
                values: new object[] { "123456789012345678", null, "AdminDiscord" });

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_UserProfiles_UserProfileId",
                table: "Tickets",
                column: "UserProfileId",
                principalTable: "UserProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
