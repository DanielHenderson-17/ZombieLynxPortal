using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TebexController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public TebexController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        //Ping endpoint to check if the controller is active
        [HttpGet("ping")]
        [AllowAnonymous]
        public IActionResult Ping()
        {
            return Ok("TebexController is active");
        }

        //Endpoint to fetch packages from Tebex
        [HttpGet("packages")]
        [Authorize]
        public async Task<IActionResult> GetPackages()
        {
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];

            if (string.IsNullOrEmpty(webstoreIdentifier))
                return BadRequest("Tebex Webstore Identifier is not configured.");

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/packages");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to fetch packages from Tebex Webstore API.");

            var json = await response.Content.ReadAsStringAsync();
            var packages = JsonSerializer.Deserialize<object>(json);

            return Ok(packages);
        }
    }
}
