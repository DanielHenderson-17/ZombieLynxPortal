using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHasAcceptedTermsToUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasAcceptedTerms",
                table: "UserProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(7213));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(9878));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 31, 22, 7, 49, 954, DateTimeKind.Utc).AddTicks(70));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 31, 22, 17, 49, 954, DateTimeKind.Utc).AddTicks(84));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(7947));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 30, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(8248));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(5552), new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(5658) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "HasAcceptedTerms",
                value: false);

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 31, 21, 57, 49, 953, DateTimeKind.Utc).AddTicks(6578));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$ahY3YXEL0jc/xGNBHLKJee3msoQfXSVKLigq56c43Dc6PVlWxtwlW");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasAcceptedTerms",
                table: "UserProfiles");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 22, 16, 58, 58, 367, DateTimeKind.Utc).AddTicks(208));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 22, 16, 58, 58, 367, DateTimeKind.Utc).AddTicks(2338));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 22, 17, 8, 58, 367, DateTimeKind.Utc).AddTicks(2484));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 22, 17, 18, 58, 367, DateTimeKind.Utc).AddTicks(2496));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 22, 16, 58, 58, 367, DateTimeKind.Utc).AddTicks(793));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 21, 16, 58, 58, 367, DateTimeKind.Utc).AddTicks(1054));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 22, 16, 58, 58, 366, DateTimeKind.Utc).AddTicks(8887), new DateTime(2025, 5, 22, 16, 58, 58, 366, DateTimeKind.Utc).AddTicks(8974) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 22, 16, 58, 58, 366, DateTimeKind.Utc).AddTicks(9667));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$QescyNTX2frru/F2TCtlMexB8k2QousoIn8uXYDuOad4gP0NHr9IK");
        }
    }
}
