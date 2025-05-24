using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoteController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public VoteController(ZombieLynxPortalAPIDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("VoteController is active.");

        // ✅ GET: /api/vote/active
        [Authorize]
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveVotes()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .Include(m => m.UserProfile)
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null)
                return NotFound("ZLGMember not found.");

            var now = DateTime.UtcNow;

            var votes = await _dbContext.Votes
                .Include(v => v.Game)
                .Select(v => new
                {
                    v.Id,
                    v.Title,
                    v.Description,
                    Game = v.Game.Name,
                    v.Game.Platform,
                    v.CreatedAt,
                    v.ExpiresAt,
                    HasExpired = v.ExpiresAt != null && v.ExpiresAt <= now,
                    HasVoted = _dbContext.VoteResults.Any(vr => vr.VoteId == v.Id && vr.ZLGMemberId == zlgMember.Id)
                })
                .ToListAsync();

            return Ok(votes);
        }

        // ✅ POST: /api/vote/{id}/submit
        [Authorize]
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitVote(int id, [FromBody] bool votedFor)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("User not authenticated.");

            var zlgMember = await _dbContext.ZLGMembers
                .Include(m => m.UserProfile)
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            if (zlgMember == null)
                return NotFound("ZLGMember profile not found.");

            var vote = await _dbContext.Votes
                .Include(v => v.Game)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vote == null)
                return NotFound("Vote not found.");

            // ✅ Phase 1: Require Steam for Steam games
            if (vote.Game.Platform.ToLower() == "steam" && string.IsNullOrEmpty(zlgMember.SteamId))
                return Forbid("You must have Steam linked to vote on this.");

            // ✅ Prevent duplicate vote
            bool hasAlreadyVoted = await _dbContext.VoteResults
                .AnyAsync(vr => vr.VoteId == vote.Id && vr.ZLGMemberId == zlgMember.Id);

            if (hasAlreadyVoted)
                return Conflict("You have already voted.");

            var voteResult = new VoteResult
            {
                VoteId = vote.Id,
                ZLGMemberId = zlgMember.Id,
                VotedFor = votedFor,
                VotedAt = DateTime.UtcNow
            };

            _dbContext.VoteResults.Add(voteResult);
            await _dbContext.SaveChangesAsync();

            return Ok("Vote submitted successfully.");
        }
        // ✅ GET: /api/vote/{id}/results
        [Authorize]
        [HttpGet("{id}/results")]
        public async Task<IActionResult> GetVoteResults(int id)
        {
            var vote = await _dbContext.Votes
                .Include(v => v.Game)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vote == null)
                return NotFound("Vote not found.");

            var results = await _dbContext.VoteResults
                .Where(vr => vr.VoteId == id)
                .ToListAsync();

            var forCount = results.Count(r => r.VotedFor);
            var againstCount = results.Count(r => !r.VotedFor);
            var total = results.Count;

            // 🧠 Determine logged in user's vote
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid.TryParse(userIdClaim, out var userId);

            var zlgMember = await _dbContext.ZLGMembers
                .Include(m => m.UserProfile)
                .FirstOrDefaultAsync(m => m.UserProfile.UserId == userId);

            bool? userVotedFor = null;

            if (zlgMember != null)
            {
                userVotedFor = await _dbContext.VoteResults
                    .Where(vr => vr.VoteId == id && vr.ZLGMemberId == zlgMember.Id)
                    .Select(vr => (bool?)vr.VotedFor)
                    .FirstOrDefaultAsync();
            }

            return Ok(new
            {
                vote.Id,
                vote.Title,
                vote.Description,
                Game = vote.Game.Name,
                Platform = vote.Game.Platform,
                vote.CreatedAt,
                vote.ExpiresAt,
                UserVote = userVotedFor, // ✅ Include user's vote
                Results = new
                {
                    For = forCount,
                    Against = againstCount,
                    TotalVotes = total
                }
            });
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateVote([FromBody] CreateVoteRequest request)
        {
            var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == request.GameId);
            if (game == null)
                return NotFound("Game not found.");

            var vote = new Vote
            {
                Title = request.Title,
                Description = request.Description,
                GameId = game.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = request.ExpiresAt
            };

            _dbContext.Votes.Add(vote);
            await _dbContext.SaveChangesAsync();

            return Ok(new { vote.Id, Message = "Vote created successfully." });
        }
        [Authorize]
        [HttpGet("/api/games")]
        public async Task<IActionResult> GetGames()
        {
            var games = await _dbContext.Games
                .OrderBy(g => g.Name)
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.Platform
                })
                .ToListAsync();

            return Ok(games);
        }

    }
}
