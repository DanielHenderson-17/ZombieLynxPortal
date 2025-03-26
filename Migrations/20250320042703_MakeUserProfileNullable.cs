using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class MakeUserProfileNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserProfileId",
                table: "Messages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 20, 4, 27, 3, 311, DateTimeKind.Utc).AddTicks(99));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 20, 4, 27, 3, 311, DateTimeKind.Utc).AddTicks(2010));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 20, 4, 37, 3, 311, DateTimeKind.Utc).AddTicks(2226));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 20, 4, 47, 3, 311, DateTimeKind.Utc).AddTicks(2251));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 20, 4, 27, 3, 311, DateTimeKind.Utc).AddTicks(595));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 3, 19, 4, 27, 3, 311, DateTimeKind.Utc).AddTicks(840));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 3, 20, 4, 27, 3, 310, DateTimeKind.Utc).AddTicks(8925), new DateTime(2025, 3, 20, 4, 27, 3, 310, DateTimeKind.Utc).AddTicks(9011) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 3, 20, 4, 27, 3, 310, DateTimeKind.Utc).AddTicks(9624));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$r5G2mUmlKL9S.NwX53GmuebylfspsBl/1PG7kTOEHtFEb3HU7hd1O");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserProfileId",
                table: "Messages",
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
        }
    }
}
