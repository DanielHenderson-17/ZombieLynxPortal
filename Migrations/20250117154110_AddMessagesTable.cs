using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMessagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MessageGroupId = table.Column<int>(type: "integer", nullable: false),
                    UserProfileId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImgUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Tickets_MessageGroupId",
                        column: x => x.MessageGroupId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_UserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "UserProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 17, 15, 41, 9, 706, DateTimeKind.Utc).AddTicks(1070));

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "CreatedAt", "ImgUrl", "MessageGroupId", "UserProfileId" },
                values: new object[,]
                {
                    { 1, "This is the first message in the ticket conversation.", new DateTime(2025, 1, 17, 15, 41, 9, 706, DateTimeKind.Utc).AddTicks(1847), null, 1, 1 },
                    { 2, "Following up on the issue. Any updates?", new DateTime(2025, 1, 17, 15, 51, 9, 706, DateTimeKind.Utc).AddTicks(2001), null, 1, 1 },
                    { 3, "Please let me know if you need more details.", new DateTime(2025, 1, 17, 16, 1, 9, 706, DateTimeKind.Utc).AddTicks(2069), null, 1, 1 }
                });

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 17, 15, 41, 9, 705, DateTimeKind.Utc).AddTicks(9808), new DateTime(2025, 1, 17, 15, 41, 9, 705, DateTimeKind.Utc).AddTicks(9897) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 17, 15, 41, 9, 706, DateTimeKind.Utc).AddTicks(513));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$.h0U.ScO5JILPgV5Tglmt.EONPckp1aGXFl.2A7HI/LBSu/MjlvWy");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MessageGroupId",
                table: "Messages",
                column: "MessageGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserProfileId",
                table: "Messages",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 15, 14, 4, 77, DateTimeKind.Utc).AddTicks(875));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 1, 14, 15, 14, 4, 76, DateTimeKind.Utc).AddTicks(9687), new DateTime(2025, 1, 14, 15, 14, 4, 76, DateTimeKind.Utc).AddTicks(9773) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 1, 14, 15, 14, 4, 77, DateTimeKind.Utc).AddTicks(371));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$g2ZekxmGvhZj9VwsVSzsH.WIZvo6dSNvBLzfOQw7MakTZ8ny5hCdi");
        }
    }
}
