using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SteamAuthController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public SteamAuthController(ZombieLynxPortalAPIDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("SteamAuthController is active.");

        [HttpGet("login")]
        public IActionResult Login()
        {
            var redirectUri = $"{Request.Scheme}://{Request.Host}/api/SteamAuth/link-steam";
            Console.WriteLine($"[SteamAuth] Redirecting to: {redirectUri}");

            return Challenge(new AuthenticationProperties
            {
                RedirectUri = redirectUri,
                IsPersistent = true
            }, "Steam");  // ✅ Use "Steam" here, NOT "Cookies"
        }


        [HttpGet("link-steam")]
        [Authorize(AuthenticationSchemes = "Steam")]
        public async Task<IActionResult> LinkSteam()
        {
            var steamId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value?.Replace("https://steamcommunity.com/openid/id/", "");
            if (string.IsNullOrEmpty(steamId)) return Unauthorized("Steam linking failed.");

            var result = await HttpContext.AuthenticateAsync("Steam");
            if (!result.Succeeded || !result.Properties.Items.TryGetValue("UserId", out var userId))
                return Unauthorized("User must be logged in.");

            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId == Guid.Parse(userId));
            if (userProfile == null) return NotFound("User profile not found.");

            var (steamName, steamImgUrl) = await GetSteamProfileAsync(steamId);
            if (steamName == null) return StatusCode(500, "Failed to fetch Steam data.");

            var existingLink = await _dbContext.ZLGMembers.FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);

            if (existingLink == null)
            {
                _dbContext.ZLGMembers.Add(new ZLGMember
                {
                    UserProfileId = userProfile.Id,
                    SteamId = steamId,
                    SteamName = steamName,
                    SteamImgUrl = steamImgUrl
                });
            }
            else
            {
                existingLink.SteamId = steamId;
                existingLink.SteamName = steamName;
                existingLink.SteamImgUrl = steamImgUrl;
            }

            await _dbContext.SaveChangesAsync();

            // ✅ Sign in the user with the "Cookies" scheme to prevent the InvalidOperationException
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userProfile.Id.ToString()),
        new Claim(ClaimTypes.Role, "User")
    };

            var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync("Cookies", claimsPrincipal);

            var jwtToken = GenerateJwtToken(userProfile.Id);

            return Content($@"<script>
                window.opener.postMessage({{ type: 'steamLinked', token: '{jwtToken}' }}, 'http://localhost:5176');
                window.close();
            </script>", "text/html");
        }

        [HttpPut("unlink")]
        [Authorize]
        public async Task<IActionResult> UnlinkSteamAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId == Guid.Parse(userId));

            if (userProfile == null) return NotFound("User profile not found.");

            var existingLink = await _dbContext.ZLGMembers.FirstOrDefaultAsync(z => z.UserProfileId == userProfile.Id);

            if (existingLink == null) return NotFound("No Steam account linked to unlink.");

            existingLink.SteamId = null;
            existingLink.SteamName = null;
            existingLink.SteamImgUrl = null;

            await _dbContext.SaveChangesAsync();

            return Ok("Steam account has been unlinked.");
        }

        [HttpGet("linked")]
        [Authorize]
        public async Task<IActionResult> GetLinkedSteamAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles.FirstOrDefaultAsync(up => up.UserId == Guid.Parse(userId));

            if (userProfile == null) return NotFound("User profile not found.");

            var linkedAccount = await _dbContext.ZLGMembers
                .Where(z => z.UserProfileId == userProfile.Id && z.SteamId != null)
                .Select(z => new { z.SteamId, z.SteamName, z.SteamImgUrl })
                .FirstOrDefaultAsync();

            return linkedAccount == null ? NotFound("No Steam account linked.") : Ok(linkedAccount);
        }


        private async Task<(string? SteamName, string? SteamImgUrl)> GetSteamProfileAsync(string steamId)
        {
            var url = $"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key={_configuration["Authentication:Steam:ApiKey"]}&steamids={steamId}";
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return (null, null);

            var player = JsonDocument.Parse(await response.Content.ReadAsStringAsync())
                .RootElement.GetProperty("response").GetProperty("players").EnumerateArray().FirstOrDefault();

            return (player.GetProperty("personaname").GetString(), player.GetProperty("avatarfull").GetString());
        }

        private string GenerateJwtToken(int userProfileId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userProfileId.ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
