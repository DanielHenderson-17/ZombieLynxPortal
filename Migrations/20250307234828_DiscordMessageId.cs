using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class DiscordMessageId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DiscordMessageId",
                table: "Messages",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 7, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(8293));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscordMessageId" },
                values: new object[] { new DateTime(2025, 3, 7, 23, 48, 28, 191, DateTimeKind.Utc).AddTicks(337), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DiscordMessageId" },
                values: new object[] { new DateTime(2025, 3, 7, 23, 58, 28, 191, DateTimeKind.Utc).AddTicks(496), null });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DiscordMessageId" },
                values: new object[] { new DateTime(2025, 3, 8, 0, 8, 28, 191, DateTimeKind.Utc).AddTicks(509), null });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 7, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(8824));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 6, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(9078));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 7, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(7061), new DateTime(2025, 3, 7, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(7149) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 7, 23, 48, 28, 190, DateTimeKind.Utc).AddTicks(7778));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$53UYtC9eUt6Thb0y3f7XwuPzGT8OPTLnExPmy5GnqWOCJijLrzU56");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordMessageId",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(8636));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 6, 2, 40, 41, 45, DateTimeKind.Utc).AddTicks(716));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 6, 2, 50, 41, 45, DateTimeKind.Utc).AddTicks(872));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 6, 3, 0, 41, 45, DateTimeKind.Utc).AddTicks(886));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(9165));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 5, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(9427));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(7350), new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(7439) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(8117));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$7SGPvmg26l8BP.eD2FB/5eL65owwOmnGA4.89BHNwJSGuVeiVydUC");
        }
    }
}
