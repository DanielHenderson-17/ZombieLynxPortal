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

        [HttpGet("user-overview-30days")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserOverviewLast30Days()
        {
            var now = DateTime.UtcNow;
            var thirtyDaysAgo = now.AddDays(-30);

            var joinsLast30Days = await _dbContext.UserProfiles
                .CountAsync(p => p.CreatedAt >= thirtyDaysAgo);

            var leavesLast30Days = await _dbContext.Users
                .CountAsync(u => !u.Active && u.LastLogin >= thirtyDaysAgo);

            var activeUsers = await _dbContext.Users
                .CountAsync(u => u.Active);

            var inactiveUsers = await _dbContext.Users
                .CountAsync(u => !u.Active);

            var marketingOptIns = await _dbContext.UserProfiles
                .CountAsync(p => p.AllowMarketingEmails);

            var marketingOptOuts = await _dbContext.UserProfiles
                .CountAsync(p => !p.AllowMarketingEmails);

            return Ok(new
            {
                joinsLast30Days,
                leavesLast30Days,
                activeUsers,
                inactiveUsers,
                marketingOptIns,
                marketingOptOuts
            });
        }
        [HttpGet("user-activity-chart-30days")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserActivityChartLast30Days()
        {
            var now = DateTime.UtcNow.Date;
            var startDate = now.AddDays(-29);
            var endDate = now.AddDays(1);

            var userProfiles = await _dbContext.UserProfiles
                .Where(p => p.CreatedAt >= startDate && p.CreatedAt < endDate)
                .ToListAsync();

            var users = await _dbContext.Users
                .Where(u => !u.Active && u.LastLogin >= startDate && u.LastLogin < endDate)
                .ToListAsync();

            var results = Enumerable.Range(0, 30)
                .Select(offset =>
                {
                    var date = startDate.AddDays(offset).Date;
                    var formattedDate = date.ToString("yyyy-MM-dd");

                    var joins = userProfiles.Count(p => p.CreatedAt.Date == date);
                    var leaves = users.Count(u => u.LastLogin?.Date == date);

                    return new
                    {
                        date = formattedDate,
                        joins,
                        leaves
                    };
                })
                .ToList();

            return Ok(results);
        }

        [HttpGet("ticket-overview-30days")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTicketOverviewLast30Days()
        {
            var now = DateTime.UtcNow;
            var start = now.Date.AddDays(-30);

            // 1. Total tickets created
            var totalCreated = await _dbContext.Tickets
                .CountAsync(t => t.CreatedAt >= start);

            // 2. Messages created
            var messageCount = await _dbContext.Messages
                .CountAsync(m => m.CreatedAt >= start);

            // 3. Average ticket duration (closed only)
            var closedTickets = await _dbContext.Tickets
                .Where(t => t.Status == "Closed" && t.UpdatedAt >= start)
                .ToListAsync();

            double averageDuration = 0;
            if (closedTickets.Any())
            {
                var totalMinutes = closedTickets
                    .Select(t => (t.UpdatedAt - t.CreatedAt).TotalMinutes)
                    .Sum();
                averageDuration = Math.Round(totalMinutes / closedTickets.Count);
            }

            // 4. Completion rate (Closed / Created)
            var totalClosed = closedTickets.Count;
            var completionRate = totalCreated > 0
                ? Math.Round((double)totalClosed / totalCreated * 100, 2)
                : 0;

            // 5. Open ticket count
            var openTickets = await _dbContext.Tickets
                .CountAsync(t => t.Status == "Open");

            // 6. Top user by ticket count
            var topUser = await _dbContext.UserTickets
                .Where(ut => ut.AssignedAt >= start)
                .GroupBy(ut => ut.UserProfileId)
                .Select(g => new
                {
                    UserProfileId = g.Key,
                    TicketCount = g.Count()
                })
                .OrderByDescending(g => g.TicketCount)
                .FirstOrDefaultAsync();

            string discordName = "--";
            int ticketCount = 0;

            if (topUser != null)
            {
                var zlgMember = await _dbContext.ZLGMembers
                    .FirstOrDefaultAsync(z => z.UserProfileId == topUser.UserProfileId);

                discordName = zlgMember?.DiscordName ?? "Unknown";
                ticketCount = topUser.TicketCount;
            }

            return Ok(new
            {
                totalCreatedLast30Days = totalCreated,
                messageCountLast30Days = messageCount,
                averageDurationMinutes = averageDuration,
                completionRatePercent = completionRate,
                openTicketCount = openTickets,
                topUserByTicketCount = new
                {
                    ticketCount,
                    discordName
                }
            });
        }
        [HttpGet("ticket-activity-chart-30days")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTicketActivityChartLast30Days()
        {
            var now = DateTime.UtcNow.Date;
            var startDate = now.AddDays(-29); // includes today
            var endDate = now.AddDays(1);     // exclusive upper bound

            // Get all tickets created in the range
            var ticketCounts = await _dbContext.Tickets
                .Where(t => t.CreatedAt >= startDate && t.CreatedAt < endDate)
                .GroupBy(t => t.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Fill missing days with 0s
            var fullData = Enumerable.Range(0, 30)
                .Select(offset =>
                {
                    var date = startDate.AddDays(offset);
                    var count = ticketCounts.FirstOrDefault(c => c.Date == date)?.Count ?? 0;
                    return new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        count
                    };
                })
                .ToList();

            return Ok(fullData);
        }

    }
}
