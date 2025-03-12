using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;
using Newtonsoft.Json;

namespace ZombieLynxPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public MessageController(ZombieLynxPortalAPIDbContext context)
        {
            _dbContext = context;
        }

        // ✅ Get all messages for a specific ticket
        [HttpGet("ticket/{ticketId}")]
        [Authorize]
        public IActionResult GetMessagesForTicket(int ticketId)
        {
            Console.WriteLine($"Fetching messages for Ticket ID: {ticketId}");

            var messages = _dbContext.Messages
                .Where(m => m.MessageGroupId == ticketId)
                .OrderBy(m => m.CreatedAt)
                .ToList() // ✅ Fetch from DB first to allow C# processing
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.CreatedAt,
                    ImgUrlsJson = string.IsNullOrEmpty(m.ImgUrlsJson) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(m.ImgUrlsJson),
                    DiscordUserId = m.DiscordUserId,
                    DiscordUserName = m.DiscordUserName,
                    DiscordImgUrl = m.DiscordImgUrl
                })
                .ToList();

            if (!messages.Any())
            {
                Console.WriteLine("No messages found. Returning an empty list.");
                return Ok(new List<object>());
            }

            return Ok(messages);
        }

        // ✅ Post a new message to a ticket
        [HttpPost]
        [Authorize]
        public IActionResult PostMessage([FromBody] MessageDTO messageDto)
        {
            if (messageDto == null || string.IsNullOrWhiteSpace(messageDto.Content))
            {
                return BadRequest("Invalid message data.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"User ID from token: {userId}");

            var userProfile = _dbContext.UserProfiles.FirstOrDefault(up => up.UserId.ToString() == userId);

            if (userProfile == null)
            {
                return BadRequest("User profile not found.");
            }

            var ticketExists = _dbContext.Tickets.Any(t => t.Id == messageDto.MessageGroupId);
            if (!ticketExists)
            {
                return NotFound($"Ticket with ID {messageDto.MessageGroupId} not found.");
            }

            // 🔍 Get Discord details
            var zlgMember = _dbContext.ZLGMembers.FirstOrDefault(z => z.UserProfileId == userProfile.Id);
            ulong? discordUserId = zlgMember != null && ulong.TryParse(zlgMember.DiscordId, out ulong parsedDiscordId)
                ? parsedDiscordId
                : null;

            string discordUserName = zlgMember?.DiscordName?.Split('#')[0] ?? $"{userProfile.FirstName} {userProfile.LastName}";
            string discordImgUrl = zlgMember?.DiscordImgUrl ?? null;

            // ✅ Ensure ImgUrlsJson is stored as a string
            var message = new Message
            {
                MessageGroupId = messageDto.MessageGroupId,
                UserProfileId = userProfile.Id,
                Content = messageDto.Content,
                CreatedAt = DateTime.UtcNow,
                ImgUrlsJson = JsonConvert.SerializeObject(messageDto.ImgUrlsJson ?? new List<string>()),
                SentToDiscord = false,
                DiscordUserId = discordUserId,
                DiscordUserName = discordUserName,
                DiscordImgUrl = discordImgUrl
            };

            _dbContext.Messages.Add(message);
            _dbContext.SaveChanges();

            return Ok(new
            {
                message.Id,
                message.Content,
                message.CreatedAt,
                ImgUrlsJson = message.ImgUrlsJson,
                User = new
                {
                    DiscordUserId = discordUserId,
                    DiscordUserName = discordUserName,
                    DiscordImgUrl = discordImgUrl
                }
            });
        }

        // ✅ Delete a message (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteMessage(int id)
        {
            var message = _dbContext.Messages.Find(id);
            if (message == null)
            {
                return NotFound($"Message with ID {id} not found.");
            }

            _dbContext.Messages.Remove(message);
            _dbContext.SaveChanges();

            return NoContent();
        }
    }
}
