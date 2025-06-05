using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;
        private readonly ILogger<DashboardController> _logger;
        private readonly IConfiguration _configuration;

        public DashboardController(ZombieLynxPortalAPIDbContext dbContext, ILogger<DashboardController> logger, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet("ticket-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTicketStats()
        {
            var now = DateTime.UtcNow;


            var startOfThisMonth = DateTime.SpecifyKind(new DateTime(now.Year, now.Month, 1), DateTimeKind.Utc);
            var startOfNextMonth = startOfThisMonth.AddMonths(1);
            var daysInMonthSoFar = (now - startOfThisMonth).Days + 1;

            var startOfLastMonth = startOfThisMonth.AddMonths(-1);
            var endOfLastMonth = startOfThisMonth;


            // Opened
            var openedThisMonth = await _dbContext.Tickets
                .CountAsync(t => t.CreatedAt >= startOfThisMonth && t.CreatedAt < startOfNextMonth);

            var openedLastMonth = await _dbContext.Tickets
                .CountAsync(t => t.CreatedAt >= startOfLastMonth && t.CreatedAt < endOfLastMonth);

            // Closed
            var closedThisMonth = await _dbContext.Tickets
                .CountAsync(t => t.Status == "Closed" && t.UpdatedAt >= startOfThisMonth && t.UpdatedAt < startOfNextMonth);

            // % closed of opened
            double percentClosed = openedThisMonth > 0
                ? Math.Round((double)closedThisMonth / openedThisMonth * 100, 2)
                : 0;

            // Change from last month
            double percentChange = openedLastMonth > 0
                ? Math.Round((double)(openedThisMonth - openedLastMonth) / openedLastMonth * 100, 2)
                : (openedThisMonth > 0 ? 100.0 : 0);

            // Avg per day
            double avgOpenedPerDay = daysInMonthSoFar > 0
                ? Math.Round((double)openedThisMonth / daysInMonthSoFar, 2)
                : 0;

            return Ok(new
            {
                openedThisMonth,
                closedThisMonth,
                percentClosed,
                avgOpenedPerDay,
                openedLastMonth,
                percentChange
            });
        }

        [HttpGet("user-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserStats()
        {
            var now = DateTime.UtcNow;

            var startOfThisMonth = DateTime.SpecifyKind(new DateTime(now.Year, now.Month, 1), DateTimeKind.Utc);
            var startOfNextMonth = startOfThisMonth.AddMonths(1);
            var daysSoFar = (now - startOfThisMonth).Days + 1;

            var startOfLastMonth = startOfThisMonth.AddMonths(-1);
            var endOfLastMonth = startOfThisMonth;

            var joinsThisMonth = await _dbContext.UserProfiles
                .CountAsync(u => u.CreatedAt >= startOfThisMonth && u.CreatedAt < startOfNextMonth);

            var joinsLastMonth = await _dbContext.UserProfiles
                .CountAsync(u => u.CreatedAt >= startOfLastMonth && u.CreatedAt < endOfLastMonth);

            var totalUsers = await _dbContext.UserProfiles.CountAsync();

            var leavesThisMonth = await _dbContext.Users
                .CountAsync(u => !u.Active && u.LastLogin >= startOfThisMonth && u.LastLogin < startOfNextMonth);

            double percentChange = joinsLastMonth > 0
                ? Math.Round(((double)(joinsThisMonth - joinsLastMonth) / joinsLastMonth) * 100, 2)
                : (joinsThisMonth > 0 ? 100.0 : 0);

            int avgPerDay = daysSoFar > 0
                ? joinsThisMonth / daysSoFar
                : 0;

            return Ok(new
            {
                joinsThisMonth,
                joinsLastMonth,
                leavesThisMonth,
                percentChange,
                avgPerDay,
                totalUsers
            });
        }


        [HttpGet("payments-report")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPaymentsReport()
        {
            var cleanRecords = await FetchAllPaymentsAsync();
            return Ok(cleanRecords);
        }

        [HttpGet("payments-recent")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRecentPayments()
        {
            var records = await FetchRecentPaymentsAsync();
            return Ok(records);
        }

        private async Task<List<FlatPaymentRecord>> FetchAllPaymentsAsync()
        {
            var records = new List<FlatPaymentRecord>();
            int currentPage = 1;
            bool hasMorePages = true;
            string secretKey = _configuration["TebexWebstore:SecretKey"];

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("X-Tebex-Secret", secretKey);

            while (hasMorePages)
            {
                var response = await httpClient.GetAsync($"https://plugin.tebex.io/payments?paged=1&page={currentPage}");
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to fetch payments from Tebex. Status Code: {response.StatusCode}");
                    break;
                }

                var content = await response.Content.ReadAsStringAsync();
                var pageData = JsonConvert.DeserializeObject<TebexPaymentsResponse>(content);

                var cleanRecords = pageData.Data
                    .Where(p => p.Status == "Complete")
                    .SelectMany(p => p.Packages.Select(pkg => new FlatPaymentRecord
                    {
                        TransactionId = p.Id,
                        Amount = p.Amount,
                        Date = p.Date,
                        PlayerName = p.Player?.Name,
                        PlayerUuid = p.Player?.UUID,
                        PackageQuantity = pkg.Quantity,
                        PackageName = pkg.Name,
                        PackageId = pkg.Id
                    }));

                records.AddRange(cleanRecords);

                currentPage++;
                hasMorePages = currentPage <= pageData.LastPage;
            }

            return records;
        }
        private async Task<List<FlatPaymentRecord>> FetchRecentPaymentsAsync()
        {
            var records = new List<FlatPaymentRecord>();
            var now = DateTime.UtcNow;
            var sixtyDaysAgo = now.AddDays(-61);
            string secretKey = _configuration["TebexWebstore:SecretKey"];

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("X-Tebex-Secret", secretKey);

            var response = await httpClient.GetAsync("https://plugin.tebex.io/payments?paged=1&page=1");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Failed to fetch recent payments from Tebex. Status Code: {response.StatusCode}");
                return records;
            }

            var content = await response.Content.ReadAsStringAsync();
            var pageData = JsonConvert.DeserializeObject<TebexPaymentsResponse>(content);

            var cleanRecords = pageData.Data
                .Where(p => p.Status == "Complete" && p.Date >= sixtyDaysAgo)
                .SelectMany(p => p.Packages.Select(pkg => new FlatPaymentRecord
                {
                    TransactionId = p.Id,
                    Amount = p.Amount,
                    Date = p.Date,
                    PlayerName = p.Player?.Name,
                    PlayerUuid = p.Player?.UUID,
                    PackageQuantity = pkg.Quantity,
                    PackageName = pkg.Name,
                    PackageId = pkg.Id
                }));

            records.AddRange(cleanRecords);
            return records;
        }

    }
}
