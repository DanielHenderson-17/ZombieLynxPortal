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
        private static readonly Dictionary<string, string> ArkSEKeys = new()
        {
            { "TheIsland", "h7IFGiljgUR6BEb91tp9R6OkMj13qbwJJUC" },
            { "TheCenter", "NxG2MDfSyVWH8NEumirPBH6d5bV13798kKf" },
            { "Ragnarok", "oX1wbBCLrsco7ofhQnXK7wZi8QBZhMy7" },
            { "ScorchedEarth", "FNmgMFR2xXwVLKEXeGWcogJiRFyyX5IKwR" },
            { "Aberration", "nihFR0dWYbN1eLfKk4wbZEZMNHdXXu8AnAZ" },
            { "Extinction", "1O4EtWbXiiglPVOS8bBRDMS1VKVrWrYa2X7" },
            { "Valguero", "Elmv22OFOYsXdfSuy6LHrzEd8NosFzoz4WI" },
            { "Genesis1", "JPtyJWlOpPmJQjqs67PmiCqILdOmqVNZF" },
            { "CrystalIsles", "NPIxspQHsxUf19dDNVhJ2CWJJZv6R2BKqH" },
            { "Genesis2", "4s3wfxL4uRCU7DizBdM6E45roeDBydhZFx" },
            { "LostIsland", "F0O3Ab0oU6qWuD0JcP473mpqXYJqrE8acqD" },
            { "Fjordur", "MISmmW0t8yaNJms5gMTbEjmGxVqz8iuG5p" }
        };

        // Get ARK: Survival Evolved servers
        [HttpGet("ark-se")]
        public async Task<IActionResult> GetArkSEServers()
        {
            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in ArkSEKeys)
                {
                    tasks.Add(FetchArkSEServerData(httpClient, serverName, apiKey));
                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        private async Task<object> FetchArkSEServerData(HttpClient httpClient, string serverName, string apiKey)
        {
            var apiUrl = $"https://ark-servers.net/api/?object=servers&element=detail&key={apiKey}";

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
                var data = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);

                return new
                {
                    ServerName = serverName,
                    IsOnline = data["is_online"] == "1",
                    Name = data["name"],
                    Version = data["version"],
                    Players = data["players"],
                    MaxPlayers = data["maxplayers"],
                    VoteUrl = $"{data["url"]}vote",
                    ConnectUrl = $"steam://connect/{data["address"]}:{data["query_port"]}"
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

        // Get Ark: Survival Ascended servers
        [HttpGet("ark-sa")]
        public async Task<IActionResult> GetArkSAServers()
        {
            var arkSAKeys = new Dictionary<string, string>
    {
        { "TheIsland", "HIjl7hbXWAcf74ypA0MW878KJMagFNtnLF" },
        { "TheCenter", "QYH8VpRofkbyOzwelMiMRbrzlSMchZEeO4K" },
        { "ScorchedEarth", "sSaD4BxOkI94kKcGJF8n0IiZEy6Vbl3EwC" },
        { "Aberration", "M1DLUX8A8EOchDfVOYR3pXma18JgTSll28R" },
        { "Extinction", "xn1RYrysYWVqLOqlJhPMIM4gpChGU19Lvph" }
    };

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in arkSAKeys)
                {
                    tasks.Add(FetchArkSAServerData(httpClient, serverName, apiKey));
                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        private async Task<object> FetchArkSAServerData(HttpClient httpClient, string serverName, string apiKey)
        {
            var apiUrl = $"https://ark-servers.net/api/?object=servers&element=detail&key={apiKey}";

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
                var data = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);

                return new
                {
                    ServerName = serverName,
                    IsOnline = data["is_online"] == "1",
                    Name = data["name"],
                    Version = data["version"],
                    Players = data["players"],
                    MaxPlayers = data["maxplayers"],
                    VoteUrl = $"{data["url"]}vote",
                    ConnectUrl = $"steam://connect/{data["address"]}:{data["query_port"]}"
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

        // Get Eco servers
        [HttpGet("eco")]
        public async Task<IActionResult> GetEcoServers()
        {
            var ecoKeys = new Dictionary<string, string>
    {
        { "Eco", "uD9XmNytF80VffSpsptOZMzZrgmKalx5NSX" }
    };

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in ecoKeys)
                {
                    tasks.Add(FetchEcoServerData(httpClient, serverName, apiKey));
                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        private async Task<object> FetchEcoServerData(HttpClient httpClient, string serverName, string apiKey)
        {
            var apiUrl = $"https://eco-servers.org/api/?object=servers&element=detail&key={apiKey}";

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
                var data = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);

                return new
                {
                    ServerName = serverName,
                    IsOnline = data["is_online"] == "1",
                    Name = data["name"],
                    Version = System.Text.RegularExpressions.Regex.Replace(data["version"], @"[^\d.]", ""),
                    Players = data["players"],
                    MaxPlayers = 100,
                    VoteUrl = $"{data["url"]}vote",
                    ConnectUrl = $"steam://connect/{data["address"]}:{data["query_port"]}"
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

        // Get Minecraft servers
        [HttpGet("minecraft")]
        public async Task<IActionResult> GetMinecraftServers()
        {
            var minecraftKeys = new Dictionary<string, string>
    {
        { "Minecraft", "7euYDFXn2afO4fwbvpYn0gxmmPXFQR4oQ5v" }
    };

            var tasks = new List<Task<object>>();

            using (var httpClient = new HttpClient())
            {
                foreach (var (serverName, apiKey) in minecraftKeys)
                {
                    tasks.Add(FetchMinecraftServerData(httpClient, serverName, apiKey));
                }

                var results = await Task.WhenAll(tasks);
                return Ok(results);
            }
        }

        private async Task<object> FetchMinecraftServerData(HttpClient httpClient, string serverName, string apiKey)
        {
            var apiUrl = $"https://minecraft-mp.com/api/?object=servers&element=detail&key={apiKey}";

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
                var data = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);

                return new
                {
                    ServerName = serverName,
                    IsOnline = data["is_online"] == "1",
                    Name = data["name"],
                    Version = data["version"],
                    Players = data["players"],
                    MaxPlayers = data["maxplayers"],
                    VoteUrl = $"{data["url"]}vote",
                    ConnectInfo = $"{data["address"]}:{data["port"]}"
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

        // Get Empyrion servers
        [HttpGet("empyrion")]
        public async Task<IActionResult> GetEmpyrionServers()
        {
            var empyrionKeys = new Dictionary<string, string>
    {
        { "ZLG Empyrion", "merbl3AVzLYebKTSwJcRFSxegkhVLteuRm4" }
    };

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

                using (var jsonDocument = JsonDocument.Parse(responseData))
                {
                    var data = jsonDocument.RootElement;

                    // Helper functions to safely read JSON elements
                    static string GetStringValue(JsonElement element) => element.ValueKind switch
                    {
                        JsonValueKind.String => element.GetString(),
                        JsonValueKind.Number => element.GetRawText(),
                        _ => null
                    };

                    static int GetIntValue(JsonElement element) => element.ValueKind switch
                    {
                        JsonValueKind.Number => element.GetInt32(),
                        JsonValueKind.String => int.TryParse(element.GetString(), out var result) ? result : 0,
                        _ => 0
                    };

                    return new
                    {
                        ServerName = serverName,
                        IsOnline = GetIntValue(data.GetProperty("is_online")) == 1,
                        Name = GetStringValue(data.GetProperty("name")),
                        Version = GetStringValue(data.GetProperty("version"))?.Replace("[^\\d.]", ""),
                        Players = GetIntValue(data.GetProperty("players")),
                        MaxPlayers = GetIntValue(data.GetProperty("maxplayers")),
                        VoteUrl = $"{GetStringValue(data.GetProperty("url"))}vote",
                        ConnectUrl = $"steam://connect/{GetStringValue(data.GetProperty("address"))}:{GetStringValue(data.GetProperty("query_port"))}"
                    };
                }
            }
            catch (HttpRequestException ex)
            {
                return new
                {
                    ServerName = serverName,
                    Error = $"Error fetching data: {ex.Message}"
                };
            }
            catch (JsonException ex)
            {
                return new
                {
                    ServerName = serverName,
                    Error = $"JSON parsing error: {ex.Message}"
                };
            }
        }

    }
}
