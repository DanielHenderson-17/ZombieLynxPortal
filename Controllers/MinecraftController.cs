using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.DTOs;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MinecraftController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly string _mysqlConnectionString;
        private readonly MinecraftLinkPointsDbContext _minecraftLinkPointsDbContext;

        public MinecraftController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration, MinecraftLinkPointsDbContext minecraftLinkPointsDbContext)
        {
            _dbContext = dbContext;
            _mysqlConnectionString = configuration.GetConnectionString("MinecraftMySql");
            _minecraftLinkPointsDbContext = minecraftLinkPointsDbContext;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("MinecraftController is active.");

        [HttpGet("linked")]
        public async Task<IActionResult> GetLinkedMinecraftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.MinecraftUuid))
                return Ok(new { Message = "No Minecraft account linked.", IsLinked = false });

            return Ok(new
            {
                zlgMember.MinecraftUuid,
                zlgMember.MinecraftUsername,
                zlgMember.MinecraftAvatarUrl
            });
        }

        [HttpPut("link-minecraft")]
        public async Task<IActionResult> LinkMinecraftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);
            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _dbContext.ZLGMembers.FirstOrDefaultAsync(m => m.UserProfileId == userProfile.Id);
            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.DiscordId))
                return BadRequest("No Discord account linked. Please link your Discord first.");

            string minecraftUuid = await GetMinecraftUuidFromDiscord(zlgMember.DiscordId);
            if (minecraftUuid == null)
                return NotFound("No Minecraft account linked to this Discord ID.");

            // Prevent duplicate Minecraft UUID linking
            var existingLink = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MinecraftUuid == minecraftUuid);

            if (existingLink != null && existingLink.UserProfileId != zlgMember.UserProfileId)
            {
                return Conflict("This Minecraft account is already linked to another user.");
            }

            var (mcUsername, mcAvatarUrl) = await FetchMinecraftProfile(minecraftUuid);
            if (mcUsername == null)
                return BadRequest("Failed to retrieve Minecraft profile.");

            zlgMember.MinecraftUuid = minecraftUuid;
            zlgMember.MinecraftUsername = mcUsername;
            zlgMember.MinecraftAvatarUrl = mcAvatarUrl;

            await _dbContext.SaveChangesAsync();

            if (!zlgMember.MinecraftLinked)
            {
                var coinsUser = await _minecraftLinkPointsDbContext.CoinsEngineUsers
                    .FirstOrDefaultAsync(u => u.uuid == minecraftUuid);

                if (coinsUser != null)
                {
                    zlgMember.Points += coinsUser.coins;
                }

                zlgMember.MinecraftLinked = true;

                await _dbContext.SaveChangesAsync();
            }

            return Ok("Minecraft account linked successfully.");
        }

        [HttpPut("unlink-minecraft")]
        public async Task<IActionResult> UnlinkMinecraftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.MinecraftUuid))
                return BadRequest("No linked Minecraft account to unlink.");

            // ✅ Record unlink in anti-abuse table
            _dbContext.PreviouslyLinkedAccounts.Add(new PreviouslyLinkedAccount
            {
                Platform = "Minecraft",
                ExternalId = zlgMember.MinecraftUuid,
                UnlinkedAt = DateTime.UtcNow
            });

            zlgMember.MinecraftUuid = null;
            zlgMember.MinecraftUsername = null;
            zlgMember.MinecraftAvatarUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Minecraft account unlinked and recorded.");
        }

        private async Task<string> GetMinecraftUuidFromDiscord(string discordId)
        {
            string uuid = null;

            using (var connection = new MySqlConnection(_mysqlConnectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    Console.WriteLine($"🔍 Checking MySQL for Discord ID: {discordId}");

                    string query = "SELECT uuid FROM discordsrv_accounts WHERE BINARY discord = @DiscordId";
                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DiscordId", discordId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                uuid = reader.IsDBNull(0) ? null : reader.GetString(0);
                                Console.WriteLine($"✅ Found UUID: {uuid}");
                            }
                            else
                            {
                                Console.WriteLine("⚠️ No UUID found for this Discord ID.");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ MySQL Query Error: " + ex.Message);
                }
            }

            return uuid;
        }

        private async Task<(string Username, string AvatarUrl)> FetchMinecraftProfile(string uuid)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await client.GetStringAsync($"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}");
                    var json = JsonDocument.Parse(response).RootElement;

                    string username = json.GetProperty("name").GetString();
                    string avatarUrl = $"https://mc-heads.net/avatar/{uuid}.png";

                    return (username, avatarUrl);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ Error fetching Minecraft profile: " + ex.Message);
                    return (null, null);
                }
            }
        }
    }
}
