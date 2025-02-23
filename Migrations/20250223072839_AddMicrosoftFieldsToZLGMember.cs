using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMicrosoftFieldsToZLGMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                value: new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(6165));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(8070));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 23, 7, 38, 38, 689, DateTimeKind.Utc).AddTicks(8224));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 23, 7, 48, 38, 689, DateTimeKind.Utc).AddTicks(8234));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(6676));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 22, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(6929));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(4970), new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(5055) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 2, 23, 7, 28, 38, 689, DateTimeKind.Utc).AddTicks(5675));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$jZ3hVeCYokY/2jDuZkbQ.u0OaBnhkn1DuvBhgiTVNcksZhv/.3nzi");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordImgUrl", "EpicImgUrl", "MicrosoftId", "MicrosoftImgUrl", "MicrosoftName", "SteamImgUrl" },
                values: new object[] { null, null, null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                value: new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(6115));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(9266));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 22, 17, 27, 39, 22, DateTimeKind.Utc).AddTicks(9534));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 22, 17, 37, 39, 22, DateTimeKind.Utc).AddTicks(9549));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(6942));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 21, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(7372));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(4182), new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(4329) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 22, 17, 17, 39, 22, DateTimeKind.Utc).AddTicks(5306));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$IfShfuwjz5GAtZHbhy/DueUfbFOEcgayHCn73ErU3QOPPmtLh3er6");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordImgUrl", "EpicImgUrl", "SteamImgUrl" },
                values: new object[] { "https://cdn.discordapp.com/avatars/123456789012345678/admin-discord.png", "https://static.epicgames.com/admin-epic-avatar.png", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/adm/adminsteam.jpg" });
        }
    }
}
