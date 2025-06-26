using System.IO;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using ZombieLynxPortalAPI.Models.BattlePass.Config;

namespace ZombieLynxPortalAPI.Services.BattlePass
{
    public static class BattlePassConfigLoader
    {
        public static BattlePassConfig LoadConfig(string path = "Config/battlepass.yaml")
        {
            if (!File.Exists(path))
                throw new FileNotFoundException($"Battle pass config not found at path: {path}");

            var yaml = File.ReadAllText(path);

            var deserializer = new DeserializerBuilder()
                .WithNamingConvention(UnderscoredNamingConvention.Instance)
                .Build();

            return deserializer.Deserialize<BattlePassConfig>(yaml);
        }
    }
}
