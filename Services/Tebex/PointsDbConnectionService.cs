using Microsoft.Extensions.Options;
using ZombieLynxPortalAPI.Models;

namespace ZombieLynxPortalAPI.Services
{
    public class PointsDbConnectionService
    {
        private readonly IReadOnlyDictionary<string, string> _connections;

        public PointsDbConnectionService(IOptions<PointsDatabaseOptions> options)
        {
            _connections = options.Value.PointsDatabases;
        }

        public string GetConnectionString(string key)
        {
            var match = _connections
                .FirstOrDefault(kvp => string.Equals(kvp.Key, key, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrEmpty(match.Key))
                return match.Value;

            throw new KeyNotFoundException($"No connection string found for key: {key}");
        }


        public IReadOnlyDictionary<string, string> GetAllConnections() => _connections;
    }
}
