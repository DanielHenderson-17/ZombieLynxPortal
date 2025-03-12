using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class SentToDiscord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SentToDiscord",
                table: "Messages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(4502));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "SentToDiscord" },
                values: new object[] { new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(6752), false });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "SentToDiscord" },
                values: new object[] { new DateTime(2025, 3, 8, 2, 3, 26, 381, DateTimeKind.Utc).AddTicks(6912), false });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "SentToDiscord" },
                values: new object[] { new DateTime(2025, 3, 8, 2, 13, 26, 381, DateTimeKind.Utc).AddTicks(6929), false });

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(5152));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 7, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(5455));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(3299), new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(3386) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 8, 1, 53, 26, 381, DateTimeKind.Utc).AddTicks(4002));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$0m7UL8HoRoVA1ZzDAO.VZuoG7uQRoXSyO3aLIbXW8eSnTbtNIABQS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SentToDiscord",
                table: "Messages");

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
                column: "CreatedAt",
                value: new DateTime(2025, 3, 7, 23, 48, 28, 191, DateTimeKind.Utc).AddTicks(337));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 7, 23, 58, 28, 191, DateTimeKind.Utc).AddTicks(496));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 8, 0, 8, 28, 191, DateTimeKind.Utc).AddTicks(509));

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
    }
}
