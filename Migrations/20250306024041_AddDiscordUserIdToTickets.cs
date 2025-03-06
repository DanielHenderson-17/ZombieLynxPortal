using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscordUserIdToTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DiscordUserId",
                table: "Tickets",
                type: "numeric(20,0)",
                nullable: true);

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
                columns: new[] { "CreatedAt", "DiscordUserId", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(7350), null, new DateTime(2025, 3, 6, 2, 40, 41, 44, DateTimeKind.Utc).AddTicks(7439) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscordUserId",
                table: "Tickets");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 4, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(6700));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 4, 5, 25, 48, 341, DateTimeKind.Utc).AddTicks(102));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 4, 5, 35, 48, 341, DateTimeKind.Utc).AddTicks(363));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 4, 5, 45, 48, 341, DateTimeKind.Utc).AddTicks(418));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 4, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(7634));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 3, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(8045));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 4, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(4435), new DateTime(2025, 3, 4, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(4587) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 4, 5, 25, 48, 340, DateTimeKind.Utc).AddTicks(5823));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$p4D8cvc2.bqroT0p91kffeZUhQ2Jyuv3X.hRmSMUrjFzZnbyCcykq");
        }
    }
}
