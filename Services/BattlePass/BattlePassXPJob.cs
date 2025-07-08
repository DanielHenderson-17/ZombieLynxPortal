using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.Services.BattlePass;
using ZombieLynxPortalAPI.Models.BattlePass.Config;

public class BattlePassXPJob : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<BattlePassXPJob> _logger;

    public BattlePassXPJob(IServiceProvider services, ILogger<BattlePassXPJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var config = BattlePassConfigLoader.LoadConfig();
        var intervalMinutes = config.XpConversion.IntervalMinutes;
        var xpPerInterval = config.XpConversion.XpPerInterval;
        var xpCap = config.DailyXpCap;
        var premiumMultiplier = config.Premium.XpMultiplier;
        var resetHour = 4;

        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            var statsDb = scope.ServiceProvider.GetRequiredService<ArkStatsDbContext>();
            var appDb = scope.ServiceProvider.GetRequiredService<ZombieLynxPortalAPIDbContext>();

            var now = DateTime.UtcNow;
            var todayCutoff = now.Hour < resetHour
                ? new DateTime(now.Year, now.Month, now.Day, resetHour, 0, 0).AddDays(-1)
                : new DateTime(now.Year, now.Month, now.Day, resetHour, 0, 0);

            var stats = await statsDb.ArkStats
                .Where(x => x.MinutesPlayed > 0)
                .ToListAsync(stoppingToken);

            foreach (var stat in stats)
            {
                var member = await appDb.ZLGMembers.FirstOrDefaultAsync(x => x.SteamId == stat.SteamId);
                if (member == null)
                    continue;

                var progress = await appDb.BattlePassProgress.FirstOrDefaultAsync(x => x.ZLGMemberId == member.Id);
                if (progress == null)
                {
                    progress = new BattlePassProgress
                    {
                        ZLGMemberId = member.Id,
                        XP = 0,
                        HasPremium = false,
                        PremiumPurchasedAt = null,
                        LastXPUpdate = null,
                        LastMinutesPlayed = 0,
                        UnprocessedMinutes = 0
                    };
                    appDb.BattlePassProgress.Add(progress);
                }

                var delta = stat.MinutesPlayed - progress.LastMinutesPlayed;
                if (delta <= 0)
                    continue;

                var totalMinutes = delta + progress.UnprocessedMinutes;
                var intervals = totalMinutes / intervalMinutes;
                var leftover = totalMinutes % intervalMinutes;

                if (intervals == 0)
                {
                    progress.UnprocessedMinutes = totalMinutes;
                    progress.LastMinutesPlayed = stat.MinutesPlayed;
                    continue;
                }

                var baseXP = intervals * xpPerInterval;
                if (progress.HasPremium)
                    baseXP = (int)Math.Round(baseXP * premiumMultiplier);

                var eligibleXP = baseXP;
                if (!progress.HasPremium)
                {
                    if (progress.LastXPUpdate < todayCutoff)
                        progress.XpEarnedToday = 0;

                    int remainingXP = xpCap - progress.XpEarnedToday;
                    eligibleXP = Math.Min(remainingXP, baseXP);
                    if (eligibleXP <= 0)
                    {
                        _logger.LogInformation($"[XP CAP] {member.DiscordName} (ZLG ID {member.Id}) hit daily XP cap of {xpCap} XP. Skipping XP gain.");
                    }
                }
                if (eligibleXP > 0)
                {
                    progress.XP += eligibleXP;
                    progress.XpEarnedToday += eligibleXP;
                    progress.LastXPUpdate = now;
                }
                progress.LastMinutesPlayed = stat.MinutesPlayed;
                progress.UnprocessedMinutes = leftover;
            }

            await appDb.SaveChangesAsync(stoppingToken);
            _logger.LogInformation("Battle Pass XP Job ran at {Time}", DateTime.Now);
            await Task.Delay(TimeSpan.FromMinutes(intervalMinutes), stoppingToken);
        }
    }
}
