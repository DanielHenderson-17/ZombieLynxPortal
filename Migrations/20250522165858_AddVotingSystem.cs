using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ZombieLynxPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddVotingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Platform = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Votes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Votes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Votes_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VoteResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VoteId = table.Column<int>(type: "integer", nullable: false),
                    ZLGMemberId = table.Column<int>(type: "integer", nullable: false),
                    VotedFor = table.Column<bool>(type: "boolean", nullable: false),
                    VotedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoteResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoteResults_Votes_VoteId",
                        column: x => x.VoteId,
                        principalTable: "Votes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VoteResults_ZLGMembers_ZLGMemberId",
                        column: x => x.ZLGMemberId,
                        principalTable: "ZLGMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordId", "DiscordImgUrl", "DiscordName" },
                values: new object[] { "1167715864339030015", "https://picsum.photos/seed/100/40/40", "AdminDiscord" });

            migrationBuilder.CreateIndex(
                name: "IX_VoteResults_VoteId",
                table: "VoteResults",
                column: "VoteId");

            migrationBuilder.CreateIndex(
                name: "IX_VoteResults_ZLGMemberId",
                table: "VoteResults",
                column: "ZLGMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Votes_GameId",
                table: "Votes",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VoteResults");

            migrationBuilder.DropTable(
                name: "Votes");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.UpdateData(
                table: "AdminTickets",
                keyColumns: new[] { "AdminId", "TicketId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(7281));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(9955));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 31, 21, 12, DateTimeKind.Utc).AddTicks(109));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 41, 21, 12, DateTimeKind.Utc).AddTicks(122));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(7909));

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 5, 17, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(8202));

            migrationBuilder.UpdateData(
                table: "Tickets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6047), new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6134) });

            migrationBuilder.UpdateData(
                table: "UserTickets",
                keyColumns: new[] { "TicketId", "UserProfileId" },
                keyValues: new object[] { 1, 1 },
                column: "AssignedAt",
                value: new DateTime(2025, 5, 18, 19, 21, 21, 11, DateTimeKind.Utc).AddTicks(6776));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$f9MejwdRspLB6Ppg5dOsAuQwPDNIMFvOWJq9diI.ChK0xHxZF0fNm");

            migrationBuilder.UpdateData(
                table: "ZLGMembers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DiscordId", "DiscordImgUrl", "DiscordName" },
                values: new object[] { "1167715864339030016", "https://cdn.discordapp.com/avatars/1167715864339030016/a9e52c811d7724ba08fbba1c4e30154d.png", "zombielynxgaming" });
        }
    }
}
