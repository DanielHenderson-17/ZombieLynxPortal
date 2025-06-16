using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using Serilog;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArkStatsController : ControllerBase
    {
        private readonly ArkStatsDbContext _dbContext;

        public ArkStatsController(ArkStatsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ✅ Simple ping endpoint
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("ArkStatsController is active.");

        // ✅ Get full stat object by SteamId
        [HttpGet("{steamId}")]
        public async Task<IActionResult> GetStatsBySteamId(string steamId)
        {
            Log.Information($"📊 Ark stats requested for SteamId: {steamId}");

            var stats = await _dbContext.ArkStats
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SteamId == steamId);

            if (stats == null)
                return NotFound($"No Ark stats found for SteamId {steamId}");

            return Ok(stats);
        }
    }
}
