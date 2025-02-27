using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMinecraftFieldsToZLGMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MinecraftAvatarUrl",
                table: "ZLGMembers",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MinecraftUsername",
                table: "ZLGMembers",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MinecraftUuid",
                table: "ZLGMembers",
                type: "character varying(36)",
                maxLength: 36,
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
                columns: new[] { "MinecraftAvatarUrl", "MinecraftUsername", "MinecraftUuid" },
                values: new object[] { "https://crafatar.com/avatars/550e8400-e29b-41d4-a716-446655440000", "AdminMinecraft", "550e8400-e29b-41d4-a716-446655440000" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinecraftAvatarUrl",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "MinecraftUsername",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "MinecraftUuid",
                table: "ZLGMembers");

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
        }
    }
}
