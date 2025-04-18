using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;
using ZombieLynxPortalAPI.Data;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Models;



namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TebexController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HttpClient _httpClient;

        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public TebexController(HttpClient httpClient, IConfiguration configuration, IHttpClientFactory httpClientFactory, ZombieLynxPortalAPIDbContext dbContext)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _dbContext = dbContext;
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

            Console.WriteLine("🛠️ Incoming basket request:");
            foreach (var item in request.Items)
            {
                Console.WriteLine($"- Package ID: {item.PackageId}, Qty: {item.Quantity}");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == userId);

            if (userProfile == null)
            {
                Console.WriteLine("❌ Could not find UserProfile for current user.");
                return BadRequest("User profile not found.");
            }

            var client = _httpClientFactory.CreateClient();
            var tebexUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets";

            var tebexPayload = new { }; // nothing but the request – no items needed here

            var response = await client.PostAsync(tebexUrl, new StringContent(
                JsonSerializer.Serialize(tebexPayload),
                Encoding.UTF8,
                "application/json"
            ));

            var resultJson = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"✅ Tebex Response ({response.StatusCode}):\n" + resultJson);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to create basket on Tebex.");

            using var doc = JsonDocument.Parse(resultJson);
            var ident = doc.RootElement.GetProperty("data").GetProperty("ident").GetString();

            if (!string.IsNullOrEmpty(ident))
            {
                _dbContext.TebexBaskets.Add(new TebexBasket
                {
                    Ident = ident,
                    UserProfileId = userProfile.Id,
                    CreatedAt = DateTime.UtcNow
                });

                await _dbContext.SaveChangesAsync();
                Console.WriteLine($"🧾 Saved TebexBasket: {ident} linked to UserProfileId {userProfile.Id}");
            }
            else
            {
                Console.WriteLine("❌ Basket ident missing from Tebex response.");
            }

            return Content(resultJson, "application/json");
        }

        [HttpPost("authenticate-basket")]
        [Authorize]
        public async Task<IActionResult> AuthenticateBasket([FromBody] string ident)
        {
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            var returnUrl = "https://google.com";

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
            Console.WriteLine("📦 AddPackageToBasket endpoint hit!");

            var client = _httpClientFactory.CreateClient();

            // 👤 Get current user
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == userId);

            if (userProfile == null)
            {
                Console.WriteLine("❌ Could not find UserProfile for current user.");
                return BadRequest("User profile not found.");
            }

            // 1️⃣ Add package to basket with custom data
            var postUrl = $"https://headless.tebex.io/api/baskets/{ident}/packages";

            var tebexPayload = new
            {
                package_id = item.PackageId,
                quantity = item.Quantity,
                variable_data = new
                {
                    server = 1671867,
                    epic_id = (string?)null,
                    user_id = userProfile.Id,
                }
            };

            var payloadJson = JsonSerializer.Serialize(tebexPayload, new JsonSerializerOptions { WriteIndented = true });
            Console.WriteLine("➡ Sending to Tebex:\n" + payloadJson);

            var jsonContent = new StringContent(payloadJson);
            jsonContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var response = await client.PostAsync(postUrl, jsonContent);
            var resultJson = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"✅ Package Added Response ({response.StatusCode}):\n{resultJson}");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"Failed to add package: {resultJson}");

            // 2️⃣ Fetch basket to return links for frontend (tebex.js)
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            var getUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets/{ident}";

            var basketResponse = await client.GetAsync(getUrl);
            var basketJson = await basketResponse.Content.ReadAsStringAsync();

            Console.WriteLine($"🧾 Basket Lookup Response ({basketResponse.StatusCode}):\n{basketJson}");

            return Content(basketJson, "application/json");
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

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"Failed to fetch basket: {resultJson}");

            return Content(resultJson, "application/json");
        }

        [HttpPost("payment-complete")]
        [AllowAnonymous]
        public async Task<IActionResult> PaymentComplete()
        {
            using var reader = new StreamReader(Request.Body);
            string rawJson = await reader.ReadToEndAsync();
            Console.WriteLine("📦 Raw JSON Payload:");
            Console.WriteLine(rawJson);

            // Deserialize manually
            var payload = JsonSerializer.Deserialize<TebexBaseWebhookDTO>(rawJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Console.WriteLine($"✅ Webhook received! Type: {payload.Type}, ID: {payload.Id}");

            if (payload.Type == "validation.webhook")
            {
                return Ok(new { id = payload.Id });
            }

            if (payload.Type == "payment.completed")
            {
                var subject = payload.Subject;

                string orderId = subject.GetProperty("transaction_id").GetString();
                var price = subject.GetProperty("price");
                decimal amount = price.GetProperty("amount").GetDecimal();
                string currency = price.GetProperty("currency").GetString();

                Console.WriteLine($"💸 Order ID: {orderId}");
                Console.WriteLine($"💰 Amount: {amount} {currency}");

                string message = $"✅ Order ID: {orderId}\n - Amount: ${amount}";

                int? userProfileIdFromCustom = null;
                string secureKeyFromCustom = null;

                if (subject.TryGetProperty("products", out var products))
                {
                    foreach (var product in products.EnumerateArray())
                    {
                        int packageId = product.GetProperty("id").GetInt32();
                        int quantity = product.GetProperty("quantity").GetInt32();

                        Console.WriteLine($"📦 Package ID: {packageId}, Quantity: {quantity}");

                        if (product.TryGetProperty("variables", out var variables))
                        {
                            foreach (var variable in variables.EnumerateArray())
                            {
                                if (variable.TryGetProperty("identifier", out var idProp) &&
                                    idProp.GetString() == "user_id" &&
                                    variable.TryGetProperty("option", out var optionProp) &&
                                    optionProp.ValueKind == JsonValueKind.String &&
                                    int.TryParse(optionProp.GetString(), out var parsedId))
                                {
                                    userProfileIdFromCustom = parsedId;
                                    Console.WriteLine($"👤 Extracted user_id from variable_data: {userProfileIdFromCustom}");
                                }
                            }
                        }

                    }
                }

                // 🧠 Extract ident from order ID
                var ident = userProfileIdFromCustom.HasValue
                    ? await _dbContext.TebexBaskets
                        .Where(b => b.UserProfileId == userProfileIdFromCustom.Value)
                        .OrderByDescending(b => b.CreatedAt)
                        .Select(b => b.Ident)
                        .FirstOrDefaultAsync()
                    : null;

                if (!string.IsNullOrEmpty(ident))
                {
                    var basket = await _dbContext.TebexBaskets
                        .FirstOrDefaultAsync(b => b.Ident == ident);

                    if (basket != null)
                    {
                        var notifyPayload = new
                        {
                            message,
                            userProfileId = basket.UserProfileId
                        };

                        var content = new StringContent(JsonSerializer.Serialize(notifyPayload), Encoding.UTF8, "application/json");
                        string baseUrl = _configuration["BaseApiUrl"];
                        var notifyResponse = await _httpClient.PostAsync($"{baseUrl}/api/notification/tebex-payment-notify", content);

                        if (notifyResponse.IsSuccessStatusCode)
                        {
                            Console.WriteLine("✅ Notification successfully sent to user.");
                        }
                        else
                        {
                            Console.WriteLine($"❌ Failed to send notification. Status: {notifyResponse.StatusCode}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"❌ No TebexBasket found for ident: {ident}");
                    }
                }
            }

            return Ok();
        }

    }
}
