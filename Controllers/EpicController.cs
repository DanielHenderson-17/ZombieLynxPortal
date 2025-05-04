using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Data.Ark;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpicController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly string _mysqlConnectionString;
        private readonly AsaLinkPointsDbContext _asaLinkPointsDbContext;

        public EpicController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration, AsaLinkPointsDbContext asaLinkPointsDbContext)
        {
            _dbContext = dbContext;
            _mysqlConnectionString = configuration.GetConnectionString("EpicMySql");
            _asaLinkPointsDbContext = asaLinkPointsDbContext;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("EpicController is active.");

        [HttpGet("linked")]
        public async Task<IActionResult> GetLinkedEpicAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.EosId))
                return Ok(new { Message = "No Epic account linked.", IsLinked = false });

            return Ok(new
            {
                zlgMember.EosId,
                zlgMember.EpicName,
                zlgMember.EpicImgUrl
            });
        }

        [HttpPut("link-epic")]
        public async Task<IActionResult> LinkEpicAccount()
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

            (string eosId, string steamName) = await GetEpicAccountFromDiscord(zlgMember.DiscordId);
            if (string.IsNullOrEmpty(eosId))
                return NotFound("No Epic account linked to this Discord ID.");

            // Prevent duplicate EOS ID linking
            var existingLink = await _dbContext.ZLGMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.EosId == eosId);

            if (existingLink != null && existingLink.UserProfileId != zlgMember.UserProfileId)
                return Conflict("This Epic account is already linked to another user.");

            zlgMember.EosId = eosId;
            zlgMember.EpicName = steamName;
            zlgMember.EpicImgUrl = null;

            await _dbContext.SaveChangesAsync();

            if (!zlgMember.ASALinked)
            {
                var wasPreviouslyLinked = await _dbContext.PreviouslyLinkedAccounts
                    .AsNoTracking()
                    .AnyAsync(p => p.Platform == "Epic" && p.ExternalId == eosId);

                using (var scope = HttpContext.RequestServices.CreateScope())
                {
                    var asaDbContext = scope.ServiceProvider.GetRequiredService<AsaLinkPointsDbContext>();

                    var asaPlayer = await asaDbContext.AsaShopPlayers
                        .FirstOrDefaultAsync(p => p.EosId == eosId);

                    if (asaPlayer != null && !wasPreviouslyLinked)
                    {
                        zlgMember.Points += asaPlayer.Points;
                    }

                    zlgMember.ASALinked = true;
                }

                await _dbContext.SaveChangesAsync();
            }

            return Ok("Epic account linked successfully.");
        }

        [HttpPut("unlink-epic")]
        public async Task<IActionResult> UnlinkEpicAccount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.EosId))
                return BadRequest("No linked Epic account to unlink.");

            var existingRecord = await _dbContext.PreviouslyLinkedAccounts
                .FirstOrDefaultAsync(p =>
                    p.Platform == "Epic" &&
                    p.ExternalId == zlgMember.EosId
                );

            if (existingRecord != null)
            {
                // ✅ Update timestamp if already exists
                existingRecord.UnlinkedAt = DateTime.UtcNow;
                _dbContext.PreviouslyLinkedAccounts.Update(existingRecord);
            }
            else
            {
                // ✅ Add new record
                _dbContext.PreviouslyLinkedAccounts.Add(new PreviouslyLinkedAccount
                {
                    Platform = "Epic",
                    ExternalId = zlgMember.EosId,
                    UnlinkedAt = DateTime.UtcNow
                });
            }

            zlgMember.EosId = null;
            zlgMember.EpicName = null;
            zlgMember.EpicImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Epic account unlinked and recorded.");
        }

        private async Task<(string EosId, string SteamName)> GetEpicAccountFromDiscord(string discordId)
        {
            string eosId = null, steamName = null;

            using (var connection = new MySqlConnection(_mysqlConnectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    Console.WriteLine($"🔍 Searching for DiscordId: '{discordId}' in MySQL");

                    string query = "SELECT EosId, SteamName FROM discordlinker WHERE BINARY CAST(DiscordId AS CHAR) = CAST(@DiscordId AS CHAR)";
                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DiscordId", discordId);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                eosId = reader.IsDBNull(0) ? null : reader.GetString(0);
                                steamName = reader.IsDBNull(1) ? null : reader.GetString(1);
                                Console.WriteLine($"✅ Match Found! EosId: {eosId}, SteamName: {steamName}");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ MySQL Query Error: " + ex.Message);
                }
            }

            return (eosId, steamName);
        }
    }
}
