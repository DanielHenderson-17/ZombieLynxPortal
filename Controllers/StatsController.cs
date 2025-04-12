using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Security.Claims;
using ZombieLynxPortalAPI.Data;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public StatsController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // ✅ Endpoint to fetch Ark stats from MariaDB
        [HttpGet("ase")]
        [Authorize]
        public IActionResult GetArkStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var userProfile = _dbContext.UserProfiles.FirstOrDefault(up => up.UserId.ToString() == userId);
            if (userProfile == null)
            {
                return NotFound("User profile not found.");
            }

            var zlgMember = _dbContext.ZLGMembers.FirstOrDefault(z => z.UserProfileId == userProfile.Id);
            if (zlgMember == null || string.IsNullOrEmpty(zlgMember.SteamId))
            {
                return Ok(new { message = "No Steam account linked. Please link your Steam account to view stats." });
            }

            var steamId = zlgMember.SteamId;

            // ✅ Connect to MariaDB
            var connectionString = _configuration.GetSection("StatsConnectionStrings:ArkQuests").Value;
            using var connection = new MySqlConnection(connectionString);
            connection.Open();

            using var command = new MySqlCommand("SELECT * FROM lethalquests_stats WHERE SteamId = @steamId", connection);
            command.Parameters.AddWithValue("@steamId", steamId);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                }

                return Ok(row);
            }

            return NotFound(new { message = "No quest stats found for your Steam ID." });
        }

    }
}
