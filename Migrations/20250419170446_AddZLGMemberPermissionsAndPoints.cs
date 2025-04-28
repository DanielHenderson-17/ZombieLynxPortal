using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddZLGMemberPermissionsAndPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PermissionGroups",
                table: "ZLGMembers",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "ZLGMembers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TimedPermissionGroups",
                table: "ZLGMembers",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(4364));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(6375));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 19, 17, 14, 46, 303, DateTimeKind.Utc).AddTicks(6524));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 19, 17, 24, 46, 303, DateTimeKind.Utc).AddTicks(6555));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(4868));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 18, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(5109));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(3149), new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(3234) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 19, 17, 4, 46, 303, DateTimeKind.Utc).AddTicks(3829));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$R3bgWmbksKB3ZSHSETrur.LAX.7MXkb66a0B/8bsz0YmkZW5KmRlm");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PermissionGroups", "Points", "TimedPermissionGroups" },
                values: new object[] { null, 0, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissionGroups",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "ZLGMembers");

            migrationBuilder.DropColumn(
                name: "TimedPermissionGroups",
                table: "ZLGMembers");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 16, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(9034));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 16, 23, 10, 20, 203, DateTimeKind.Utc).AddTicks(1056));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 16, 23, 20, 20, 203, DateTimeKind.Utc).AddTicks(1210));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 16, 23, 30, 20, 203, DateTimeKind.Utc).AddTicks(1239));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 16, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(9526));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 15, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(9777));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 4, 16, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(7793), new DateTime(2025, 4, 16, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(7878) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 4, 16, 23, 10, 20, 202, DateTimeKind.Utc).AddTicks(8529));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$O.sgWeC8cDiOjTXohaa6D.BVpKzhwGAcAsV9/umWJoywvbbpm0Zc2");
        }
    }
}
