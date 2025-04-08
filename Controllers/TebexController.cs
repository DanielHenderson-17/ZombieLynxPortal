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
            var projectId = _configuration["TebexWebstore:ProjectId"];
            var privateKey = _configuration["TebexWebstore:PrivateKey"];

            if (string.IsNullOrEmpty(projectId) || string.IsNullOrEmpty(privateKey))
                return BadRequest("Tebex Webstore API credentials are not configured.");

            var client = _httpClientFactory.CreateClient();
            var byteArray = System.Text.Encoding.ASCII.GetBytes($"{projectId}:{privateKey}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            var response = await client.GetAsync("https://developers.tebex.io/packages");
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to fetch packages from Tebex Webstore API.");

            var json = await response.Content.ReadAsStringAsync();
            var packages = JsonSerializer.Deserialize<object>(json);

            return Ok(packages);
        }

    }
}
