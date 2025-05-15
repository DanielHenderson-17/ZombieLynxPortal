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
using ZombieLynxPortalAPI.Services.Tebex;
using Serilog;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TebexController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HttpClient _httpClient;
        private readonly TebexOrderProcessor _orderProcessor;


        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public TebexController(HttpClient httpClient, IConfiguration configuration, IHttpClientFactory httpClientFactory, ZombieLynxPortalAPIDbContext dbContext, TebexOrderProcessor orderProcessor)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _dbContext = dbContext;
            _orderProcessor = orderProcessor;
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
            Log.Information("🔥 CreateBasket DTO endpoint HIT!");

            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            if (string.IsNullOrEmpty(webstoreIdentifier))
                return BadRequest("Tebex Webstore Identifier is not configured.");

            Log.Information("🛠️ Incoming basket request:");
            foreach (var item in request.Items)
            {
                Log.Information($"- Package ID: {item.PackageId}, Qty: {item.Quantity}");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == userId);

            if (userProfile == null)
            {
                Log.Information("❌ Could not find UserProfile for current user.");
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

            Log.Information($"✅ Tebex Response ({response.StatusCode}):\n" + resultJson);

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
                Log.Information($"🧾 Saved TebexBasket: {ident} linked to UserProfileId {userProfile.Id}");
            }
            else
            {
                Log.Information("❌ Basket ident missing from Tebex response.");
            }

            return Content(resultJson, "application/json");
        }

        [HttpPost("authenticate-basket")]
        [Authorize]
        public async Task<IActionResult> AuthenticateBasket([FromBody] string ident)
        {
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];
            var returnUrl = "https://zlg.gg/tebex-return.html";

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
            Log.Information("📦 AddPackageToBasket endpoint hit!");

            var client = _httpClientFactory.CreateClient();

            // 👤 Get current user
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId.ToString() == userId);

            if (userProfile == null)
            {
                Log.Information("❌ Could not find UserProfile for current user.");
                return BadRequest("User profile not found.");
            }

            // 🧾 Load Tebex Webstore Identifier (reused below)
            var webstoreIdentifier = _configuration["TebexWebstore:WebstoreIdentifier"];

            // 🛑 Prevent abuse: Free packages cannot be added more than once
            if (item.Quantity > 1)
            {
                var packageResp = await client.GetAsync($"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/packages/{item.PackageId}");
                var packageJson = await packageResp.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(packageJson);
                decimal price = doc.RootElement.GetProperty("data").GetProperty("price").GetDecimal();

                if (price == 0)
                {
                    Log.Information("🚫 Attempted to add more than one of a free package.");
                    return BadRequest("Free packages can only be added once.");
                }
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
            Log.Information("➡ Sending to Tebex:\n" + payloadJson);

            var jsonContent = new StringContent(payloadJson);
            jsonContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var response = await client.PostAsync(postUrl, jsonContent);
            var resultJson = await response.Content.ReadAsStringAsync();

            Log.Information($"✅ Package Added Response ({response.StatusCode}):\n{resultJson}");

            if ((int)response.StatusCode == 400)
            {
                using var doc = JsonDocument.Parse(resultJson);
                var detail = doc.RootElement.GetProperty("detail").GetString();

                if (detail != null && detail.Contains("purchased too many times"))
                {
                    Log.Information("🚫 Package has been purchased too many times. Rejecting.");
                    return BadRequest(new
                    {
                        error = "limit_reached",
                        message = detail
                    });
                }
            }

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"Failed to add package: {resultJson}");

            // 2️⃣ Fetch basket to return links for frontend (tebex.js)
            var getUrl = $"https://headless.tebex.io/api/accounts/{webstoreIdentifier}/baskets/{ident}";

            var basketResponse = await client.GetAsync(getUrl);
            var basketJson = await basketResponse.Content.ReadAsStringAsync();

            Log.Information($"🧾 Basket Lookup Response ({basketResponse.StatusCode}):\n{basketJson}");

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
            Log.Information("📦 Raw JSON Payload:");
            Log.Information(rawJson);

            // Deserialize manually
            var payload = JsonSerializer.Deserialize<TebexBaseWebhookDTO>(rawJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Log.Information($"✅ Webhook received! Type: {payload.Type}, ID: {payload.Id}");

            if (payload.Type == "validation.webhook")
            {
                return Ok(new { id = payload.Id });
            }

            if (payload.Type == "payment.completed")
            {
                var subject = payload.Subject;

                string orderId = subject.GetProperty("transaction_id").GetString();
                var alreadyProcessed = await _dbContext.ProcessedTransactions
                    .AnyAsync(t => t.TransactionId == orderId);

                if (alreadyProcessed)
                {
                    Log.Warning($"⛔ Duplicate transaction detected: {orderId}. Skipping.");
                    return Ok();
                }

                var price = subject.GetProperty("price");
                decimal amount = price.GetProperty("amount").GetDecimal();
                string currency = price.GetProperty("currency").GetString();

                Log.Information($"💸 Order ID: {orderId}");
                Log.Information($"💰 Amount: {amount} {currency}");

                string message = $"✅ Order ID: {orderId}\n - Amount: ${amount}";

                int? userProfileIdFromCustom = null;

                if (subject.TryGetProperty("products", out var products))
                {
                    foreach (var product in products.EnumerateArray())
                    {
                        int packageId = product.GetProperty("id").GetInt32();
                        int quantity = product.GetProperty("quantity").GetInt32();

                        Log.Information($"📦 Package ID: {packageId}, Quantity: {quantity}");

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
                                    Log.Information($"👤 Extracted user_id from variable_data: {userProfileIdFromCustom}");
                                }
                            }

                            if (!userProfileIdFromCustom.HasValue)
                            {
                                Log.Warning("❌ No user_id found in payment webhook. Skipping processing gracefully.");
                                return Ok();
                            }

                            await _orderProcessor.ProcessOrderAsync(new TebexOrderActionDTO
                            {
                                UserProfileId = userProfileIdFromCustom.Value,
                                PackageId = packageId,
                                Quantity = quantity,
                                Custom = product.GetProperty("custom").GetString() ?? ""
                            });
                            _dbContext.ProcessedTransactions.Add(new ProcessedTransaction
                            {
                                TransactionId = orderId,
                                ProcessedAt = DateTime.UtcNow
                            });

                            await _dbContext.SaveChangesAsync();
                            Log.Information($"🧾 Logged processed transaction: {orderId}");
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
                            Log.Information("✅ Notification successfully sent to user.");
                        }
                        else
                        {
                            Log.Information($"❌ Failed to send notification. Status: {notifyResponse.StatusCode}");
                        }
                    }
                    else
                    {
                        Log.Information($"❌ No TebexBasket found for ident: {ident}");
                    }
                }


            }

            return Ok();
        }


        // *** KEEP FOR VALIDATION OF WEBHOOK ***
        //Webhook validation Tebex
        // [HttpPost("payment-complete")]
        // [AllowAnonymous]
        // public async Task<IActionResult> PaymentComplete()
        // {
        //     using var reader = new StreamReader(Request.Body);
        //     var rawJson = await reader.ReadToEndAsync();
        //     Log.Information("📦 Raw JSON Payload:");
        //     Log.Information(rawJson);
        //     using var doc = JsonDocument.Parse(rawJson);
        //     var root = doc.RootElement;
        //     if (root.TryGetProperty("type", out var typeProp) &&
        //         typeProp.GetString() == "validation.webhook" &&
        //         root.TryGetProperty("id", out var idProp))
        //     {
        //         var id = idProp.GetString();
        //         Log.Information($"✅ Validation webhook received. ID: {id}");
        //         var result = new { id = id };
        //         return new JsonResult(result);
        //     }
        //     Log.Information("✅ Received non-validation webhook or invalid payload.");
        //     return Ok();
        // }
    }
}
