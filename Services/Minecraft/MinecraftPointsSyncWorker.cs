using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ZombieLynxPortalAPI.Services.Minecraft
{
    public class MinecraftPointsSyncWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public MinecraftPointsSyncWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var syncService = scope.ServiceProvider.GetRequiredService<MinecraftPointsSyncService>();
                    await syncService.SyncPendingPointsAsync();
                }

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }
}
