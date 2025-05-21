using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/server")]
    public class ServerController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ServerController(IConfiguration config)
        {
            _config = config;
        }

        // Get Ark: Survival Evolved servers
        [HttpGet("ark-se")]
        public async Task<IActionResult> GetArkSEServers()
        {
            var arkSEKeys = _config.GetSection("ServerApiKeys:ArkSE").Get<Dictionary<string, string>>();
            if (arkSEKeys == null || arkSEKeys.Count == 0)
                return BadRequest("No ArkSE API keys configured.");

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in arkSEKeys)
                {
                    var apiUrl = $"https://ark-servers.net/api/?object=servers&element=detail&key={apiKey}";
                    tasks.Add(FetchGenericServerData(httpClient, serverName, apiUrl, data => new
                    {
                        ServerName = serverName,
                        IsOnline = data.TryGetValue("is_online", out var isOnlineVal) && isOnlineVal == "1",
                        Name = data.TryGetValue("name", out var nameVal) ? nameVal : "Unknown",
                        Version = data.TryGetValue("version", out var versionVal) ? versionVal : "Unknown",
                        Players = data.TryGetValue("players", out var playersVal) ? playersVal : "0",
                        MaxPlayers = data.TryGetValue("maxplayers", out var maxPlayersVal) ? maxPlayersVal : "0",
                        VoteUrl = data.TryGetValue("url", out var urlVal) ? $"{urlVal}vote" : "Unavailable",
                        ConnectUrl = (data.TryGetValue("address", out var addressVal) && data.TryGetValue("query_port", out var portVal))
                            ? $"steam://connect/{addressVal}:{portVal}"
                            : "Unavailable"
                    }));

                }
                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        // Get Ark: Survival Ascended servers
        [HttpGet("ark-sa")]
        public async Task<IActionResult> GetArkSAServers()
        {
            var arkSAKeys = _config.GetSection("ServerApiKeys:ArkSA").Get<Dictionary<string, string>>();
            if (arkSAKeys == null || arkSAKeys.Count == 0)
                return BadRequest("No ArkSA API keys configured.");

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in arkSAKeys)
                {
                    var apiUrl = $"https://ark-servers.net/api/?object=servers&element=detail&key={apiKey}";
                    tasks.Add(FetchGenericServerData(httpClient, serverName, apiUrl, data => new
                    {
                        ServerName = serverName,
                        IsOnline = data.TryGetValue("is_online", out var isOnlineVal) && isOnlineVal == "1",
                        Name = data.TryGetValue("name", out var nameVal) ? nameVal : "Unknown",
                        Version = data.TryGetValue("version", out var versionVal) ? versionVal : "Unknown",
                        Players = data.TryGetValue("players", out var playersVal) ? playersVal : "0",
                        MaxPlayers = data.TryGetValue("maxplayers", out var maxPlayersVal) ? maxPlayersVal : "0",
                        VoteUrl = data.TryGetValue("url", out var urlVal) ? $"{urlVal}vote" : "Unavailable",
                        ConnectUrl = (data.TryGetValue("address", out var addressVal) && data.TryGetValue("query_port", out var portVal))
                            ? $"steam://connect/{addressVal}:{portVal}"
                            : "Unavailable"
                    }));

                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        // Get Eco servers
        [HttpGet("eco")]
        public async Task<IActionResult> GetEcoServers()
        {
            var ecoKeys = _config.GetSection("ServerApiKeys:Eco").Get<Dictionary<string, string>>();
            if (ecoKeys == null || ecoKeys.Count == 0)
                return BadRequest("No Eco API keys configured.");

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in ecoKeys)
                {
                    var apiUrl = $"https://eco-servers.org/api/?object=servers&element=detail&key={apiKey}";
                    tasks.Add(FetchGenericServerData(httpClient, serverName, apiUrl, data => new
                    {
                        ServerName = serverName,
                        IsOnline = data.TryGetValue("is_online", out var isOnlineVal) && isOnlineVal == "1",
                        Name = data.TryGetValue("name", out var nameVal) ? nameVal : "Unknown",
                        Version = data.TryGetValue("version", out var versionVal)
                            ? System.Text.RegularExpressions.Regex.Replace(versionVal, @"[^\d.]", "")
                            : "Unknown",
                        Players = data.TryGetValue("players", out var playersVal) ? playersVal : "0",
                        MaxPlayers = 100,
                        VoteUrl = data.TryGetValue("url", out var urlVal) ? $"{urlVal}vote" : "Unavailable",
                        ConnectUrl = (data.TryGetValue("address", out var addressVal) && data.TryGetValue("query_port", out var portVal))
                            ? $"steam://connect/{addressVal}:{portVal}"
                            : "Unavailable"
                    }));
                }
                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        // Get Minecraft servers
        [HttpGet("minecraft")]
        public async Task<IActionResult> GetMinecraftServers()
        {
            var minecraftKeys = _config.GetSection("ServerApiKeys:Minecraft").Get<Dictionary<string, string>>();
            if (minecraftKeys == null || minecraftKeys.Count == 0)
                return BadRequest("No Minecraft API keys configured.");

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in minecraftKeys)
                {
                    var apiUrl = $"https://minecraft-mp.com/api/?object=servers&element=detail&key={apiKey}";
                    tasks.Add(FetchGenericServerData(httpClient, serverName, apiUrl, data => new
                    {
                        ServerName = serverName,
                        IsOnline = data.TryGetValue("is_online", out var isOnlineVal) && isOnlineVal == "1",
                        Name = data.TryGetValue("name", out var nameVal) ? nameVal : "Unknown",
                        Version = data.TryGetValue("version", out var versionVal) ? versionVal : "Unknown",
                        Players = data.TryGetValue("players", out var playersVal) ? playersVal : "0",
                        MaxPlayers = data.TryGetValue("maxplayers", out var maxPlayersVal) ? maxPlayersVal : "0",
                        VoteUrl = data.TryGetValue("url", out var urlVal) ? $"{urlVal}vote" : "Unavailable",
                        ConnectInfo = (data.TryGetValue("address", out var addressVal) && data.TryGetValue("port", out var portVal))
                            ? $"{addressVal}:{portVal}"
                            : "Unavailable"
                    }));
                }
                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        // Get Empyrion servers
        [HttpGet("empyrion")]
        public async Task<IActionResult> GetEmpyrionServers()
        {
            var empyrionKeys = _config.GetSection("ServerApiKeys:Empyrion").Get<Dictionary<string, string>>();
            if (empyrionKeys == null || empyrionKeys.Count == 0)
                return BadRequest("No Empyrion API keys configured.");

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in empyrionKeys)
                {
                    tasks.Add(FetchEmpyrionServerData(httpClient, serverName, apiKey));
                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        private async Task<object> FetchEmpyrionServerData(HttpClient httpClient, string serverName, string apiKey)
        {
            var apiUrl = $"https://empyrion-servers.com/api/?object=servers&element=detail&key={apiKey}";

            try
            {
                var response = await httpClient.GetAsync(apiUrl);
                if (!response.IsSuccessStatusCode)
                {
                    return new
                    {
                        ServerName = serverName,
                        Error = $"Failed to fetch data (status code: {response.StatusCode})."
                    };
                }

                var responseData = await response.Content.ReadAsStringAsync();

                JsonDocument dataDoc;
                try
                {
                    dataDoc = JsonDocument.Parse(responseData);
                }
                catch (JsonException jsonEx)
                {
                    return new
                    {
                        ServerName = serverName,
                        Error = $"JSON parse error: {jsonEx.Message}"
                    };
                }

                var data = dataDoc.RootElement;

                static string GetString(JsonElement e, string prop) =>
                    e.TryGetProperty(prop, out var val) && val.ValueKind == JsonValueKind.String
                        ? val.GetString()
                        : null;

                static int GetInt(JsonElement e, string prop) =>
                    e.TryGetProperty(prop, out var val) && val.ValueKind == JsonValueKind.Number
                        ? val.GetInt32()
                        : (val.ValueKind == JsonValueKind.String && int.TryParse(val.GetString(), out var result) ? result : 0);

                return new
                {
                    ServerName = serverName,
                    IsOnline = GetInt(data, "is_online") == 1,
                    Name = GetString(data, "name") ?? "Unknown",
                    Version = (GetString(data, "version") ?? "Unknown").Replace("[^\\d.]", ""),
                    Players = GetInt(data, "players"),
                    MaxPlayers = GetInt(data, "maxplayers"),
                    VoteUrl = $"{GetString(data, "url") ?? ""}vote",
                    ConnectUrl = (GetString(data, "address") is string address && GetString(data, "query_port") is string port)
                        ? $"steam://connect/{address}:{port}"
                        : "Unavailable"
                };
            }
            catch (HttpRequestException ex)
            {
                return new
                {
                    ServerName = serverName,
                    Error = $"Error fetching data: {ex.Message}"
                };
            }
        }

        // Shared fetch logic for most servers
        private async Task<object> FetchGenericServerData(
            HttpClient httpClient,
            string serverName,
            string apiUrl,
            Func<Dictionary<string, string>, object> mapper)
        {
            try
            {
                var response = await httpClient.GetAsync(apiUrl);
                if (!response.IsSuccessStatusCode)
                {
                    return new { ServerName = serverName, Error = $"Failed to fetch data (status code: {response.StatusCode})" };
                }

                var responseData = await response.Content.ReadAsStringAsync();

                Dictionary<string, string> data;
                try
                {
                    data = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);
                }
                catch (JsonException jsonEx)
                {
                    return new { ServerName = serverName, Error = $"JSON parse error: {jsonEx.Message}" };
                }

                return mapper(data);
            }
            catch (HttpRequestException ex)
            {
                return new { ServerName = serverName, Error = $"Error fetching data: {ex.Message}" };
            }
        }
    }
}
