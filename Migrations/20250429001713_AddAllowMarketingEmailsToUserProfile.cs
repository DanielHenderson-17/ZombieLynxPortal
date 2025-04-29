using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAllowMarketingEmailsToUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowMarketingEmails",
                table: "UserProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 29, 0, 17, 13, 143, DateTimeKind.Utc).AddTicks(9587));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 29, 0, 17, 13, 144, DateTimeKind.Utc).AddTicks(1729));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 29, 0, 27, 13, 144, DateTimeKind.Utc).AddTicks(1906));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 29, 0, 37, 13, 144, DateTimeKind.Utc).AddTicks(1917));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 29, 0, 17, 13, 144, DateTimeKind.Utc).AddTicks(224));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 28, 0, 17, 13, 144, DateTimeKind.Utc).AddTicks(479));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 29, 0, 17, 13, 143, DateTimeKind.Utc).AddTicks(8276), new DateTime(2025, 4, 29, 0, 17, 13, 143, DateTimeKind.Utc).AddTicks(8364) });

            migrationBuilder.UpdateData(
                table: "UserProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "AllowMarketingEmails",
                value: true);

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 29, 0, 17, 13, 143, DateTimeKind.Utc).AddTicks(9049));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$cvwh.EJPRDCTBgb4Lh0MCuuSVENuyMLox192v1PbkrUS2yKocZmKm");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowMarketingEmails",
                table: "UserProfiles");

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
                column: "PasswordHash",
                value: "$2a$11$/X5N6lN.VQSqF5vdU42zOuY6OkMG7uBkBZh.CiNoAFCv.NqTQ3Ryy");
        }
    }
}
