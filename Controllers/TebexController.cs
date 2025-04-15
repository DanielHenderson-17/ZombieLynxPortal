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
        private readonly HttpClient _httpClient;

        public TebexController(HttpClient httpClient, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        // ✅ Ping to check controller is active
        [HttpGet("ping")]
        [AllowAnonymous]
        public IActionResult Ping()
        {
            return Ok("TebexController is active");
        }

        // ✅ Fetch all packages from Tebex
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

        // ✅ Create a basket to pass to Tebex.js checkout
        [HttpPost("create-basket")]
        [Authorize]
        public async Task<IActionResult> CreateBasket([FromBody] BasketRequestDTO request)
        {
            Console.WriteLine("🔥 CreateBasket DTO endpoint HIT!");

            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            if (string.IsNullOrEmpty(webstoreIdentifier))
                return BadRequest("Tebex Webstore Identifier is not configured.");

            // 📥 Log incoming payload
            Console.WriteLine("🛠️ Incoming basket request:");
            foreach (var item in request.Items)
            {
                Console.WriteLine($"- Package ID: {item.PackageId}, Qty: {item.Quantity}");
            }

            var client = _httpClientFactory.CreateClient();
            var tebexUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets";

            var tebexPayload = new
            {
                items = request.Items.Select(i => new
                {
                    package = new { id = i.PackageId },
                    quantity = i.Quantity
                })
            };

            // 📤 Log payload sent to Tebex
            var debugJson = JsonSerializer.Serialize(tebexPayload, new JsonSerializerOptions { WriteIndented = true });
            Console.WriteLine("➡ Sending to Tebex:\n" + debugJson);

            var jsonContent = new StringContent(JsonSerializer.Serialize(tebexPayload));
            jsonContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var response = await client.PostAsync(tebexUrl, jsonContent);

            var resultJson = await response.Content.ReadAsStringAsync();

            // 📩 Log Tebex response
            Console.WriteLine($"✅ Tebex Response ({response.StatusCode}):\n" + resultJson);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to create basket on Tebex.");

            return Content(resultJson, "application/json");
        }

        [HttpPost("authenticate-basket")]
        [Authorize]
        public async Task<IActionResult> AuthenticateBasket([FromBody] string ident)
        {
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            var returnUrl = "https://localhost:5174/shop/cart";

            var authUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets/{ident}/auth?returnUrl={Uri.EscapeDataString(returnUrl)}";

            var request = new HttpRequestMessage(HttpMethod.Get, authUrl);
            request.Headers.Add("Accept", "application/json");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to initiate authentication.");
            }

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }

        // ✅ Add packages to an authenticated basket
        [HttpPost("add-package/{ident}")]
        [Authorize]
        public async Task<IActionResult> AddPackageToBasket([FromRoute] string ident, [FromBody] BasketItemDTO item)
        {
            var client = _httpClientFactory.CreateClient();

            var tebexUrl = $"https://headless.tebex.io/api/baskets/{ident}/packages";

            var tebexPayload = new
            {
                package_id = item.PackageId,
                quantity = item.Quantity,
                variable_data = new
                {
                    server = 1671867,
                    epic_id = (string?)null
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(tebexPayload));
            jsonContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var response = await client.PostAsync(tebexUrl, jsonContent);
            var resultJson = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"✅ Tebex Add Package Response ({response.StatusCode}):\n{resultJson}");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"Failed to add package: {resultJson}");

            return Content(resultJson, "application/json");
        }
        // ✅ Fetch finalized basket details for Tebex.js checkout
        [HttpGet("basket/{ident}")]
        [Authorize]
        public async Task<IActionResult> GetBasket([FromRoute] string ident)
        {
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            if (string.IsNullOrEmpty(webstoreIdentifier))
                return BadRequest("Tebex Webstore Identifier is not configured.");

            var client = _httpClientFactory.CreateClient();
            var tebexUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets/{ident}";

            var response = await client.GetAsync(tebexUrl);
            var resultJson = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"✅ Tebex Basket Fetch Response ({response.StatusCode}):\n{resultJson}");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"Failed to fetch basket: {resultJson}");

            return Content(resultJson, "application/json");
        }

    }
}
