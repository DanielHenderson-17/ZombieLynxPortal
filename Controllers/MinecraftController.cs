using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
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

        // ✅ MySQL Database Credentials (Modify as needed)
        private const string MySqlHost = "192.168.1.245";
        private const string MySqlPort = "3306";
        private const string MySqlUser = "root";
        private const string MySqlPassword = "Udafoo1717!";
        private const string MySqlDatabase = "minecraft_users";

        public MinecraftController(ZombieLynxPortalAPIDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ✅ PING Endpoint (For Debugging)
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("MinecraftController is active.");

        // ✅ Check if Minecraft is linked
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
                return Ok(new
                {
                    Message = "No Minecraft account linked.",
                    IsLinked = false
                });

            return Ok(new
            {
                zlgMember.MinecraftUuid,
                zlgMember.MinecraftUsername,
                zlgMember.MinecraftAvatarUrl
            });
        }

        // ✅ Link Minecraft Account
        [HttpPut("link-minecraft")]
        public async Task<IActionResult> LinkMinecraftAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);

            if (userProfile == null)
                return NotFound("User profile not found.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfileId == userProfile.Id);

            if (zlgMember == null)
            {
                return BadRequest("You must link your Discord account first.");
            }

            if (string.IsNullOrEmpty(zlgMember.DiscordId))
            {
                return BadRequest("No Discord account linked. Please link your Discord first.");
            }

            // 🔹 Check external MySQL database for the Discord ID
            string minecraftUuid = await GetMinecraftUuidFromDiscord(zlgMember.DiscordId);
            if (minecraftUuid == null)
                return NotFound("No Minecraft account linked to this Discord ID.");

            // 🔹 Fetch Minecraft Username & Avatar
            var (mcUsername, mcAvatarUrl) = await FetchMinecraftProfile(minecraftUuid);
            if (mcUsername == null)
                return BadRequest("Failed to retrieve Minecraft profile.");

            // 🔹 Save to ZLGMember Table
            zlgMember.MinecraftUuid = minecraftUuid;
            zlgMember.MinecraftUsername = mcUsername;
            zlgMember.MinecraftAvatarUrl = mcAvatarUrl;

            await _dbContext.SaveChangesAsync();

            return Ok("Minecraft account linked successfully.");
        }

        // ✅ Unlink Minecraft Account
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

            // 🔹 Remove Minecraft link from ZLGMember
            zlgMember.MinecraftUuid = null;
            zlgMember.MinecraftUsername = null;
            zlgMember.MinecraftAvatarUrl = null;
            await _dbContext.SaveChangesAsync();

            return Ok("Minecraft account unlinked successfully.");
        }

        // ✅ Fetch Minecraft UUID from MySQL (discordsrv_accounts)
        private async Task<string> GetMinecraftUuidFromDiscord(string discordId)
        {
            string uuid = null;
            string connectionString = $"Server={MySqlHost};Port={MySqlPort};Database={MySqlDatabase};User={MySqlUser};Password={MySqlPassword};";

            using (var connection = new MySqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    Console.WriteLine($"🔍 Checking MySQL for Discord ID: {discordId}");

                    string query = "SELECT uuid FROM discordsrv_accounts WHERE BINARY discord = @DiscordId";
                    Console.WriteLine($"🔍 Running Query: {query} with DiscordId: {discordId}");

                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DiscordId", discordId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                uuid = reader.IsDBNull(0) ? null : reader.GetString(0);  // ✅ This prevents the error
                            }


                            // ✅ Fix: Check for DBNull and safely cast
                            object result = reader["uuid"];
                            if (result != DBNull.Value)
                            {
                                uuid = result.ToString();
                                Console.WriteLine($"✅ Found UUID: {uuid}");
                            }
                            else
                            {
                                Console.WriteLine("⚠️ UUID is NULL in database.");
                                return null;
                            }
                        }
                    }
                    Console.WriteLine($"✅ Query executed. UUID Retrieved: {uuid ?? "NULL"}");

                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ Error querying MySQL database: " + ex.Message);
                }
            }

            return uuid;
        }

        // ✅ Fetch Minecraft Username & Avatar
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
