using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class verifiedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(5350));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(7563));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 33, 19, 52, DateTimeKind.Utc).AddTicks(7707));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 43, 19, 52, DateTimeKind.Utc).AddTicks(7718));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(5909));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 27, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(6333));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(4147), new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(4232) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 28, 12, 23, 19, 52, DateTimeKind.Utc).AddTicks(4871));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "PasswordHash", "Verified" },
                values: new object[] { "$2a$11$/X5N6lN.VQSqF5vdU42zOuY6OkMG7uBkBZh.CiNoAFCv.NqTQ3Ryy", false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 28, 12, 19, 0, 145, DateTimeKind.Utc).AddTicks(1140));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 19, 0, 145, DateTimeKind.Utc).AddTicks(3373));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 29, 0, 145, DateTimeKind.Utc).AddTicks(3522));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 39, 0, 145, DateTimeKind.Utc).AddTicks(3534));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 12, 19, 0, 145, DateTimeKind.Utc).AddTicks(1693));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 27, 12, 19, 0, 145, DateTimeKind.Utc).AddTicks(2124));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 28, 12, 19, 0, 144, DateTimeKind.Utc).AddTicks(9911), new DateTime(2025, 4, 28, 12, 19, 0, 144, DateTimeKind.Utc).AddTicks(9993) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 28, 12, 19, 0, 145, DateTimeKind.Utc).AddTicks(634));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$XH.Larz.d6lUTO8QKb38TO2GEJw4/JaYPNrtWypueVaK2KsOBz0hW");
        }
    }
}
