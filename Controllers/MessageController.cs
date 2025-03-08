using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZombieLynxPortalAPI.Data;
using ZombieLynxPortalAPI.Models;
using ZombieLynxPortalAPI.DTOs;
using System.Security.Claims;

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
                .Include(m => m.UserProfile)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.CreatedAt,
                    m.ImgUrl,
                    User = new
                    {
                        m.UserProfile.FirstName,
                        m.UserProfile.LastName,
                        DiscordImgUrl = _dbContext.ZLGMembers
                            .Where(z => z.UserProfileId == m.UserProfile.Id)
                            .Select(z => z.DiscordImgUrl)
                            .FirstOrDefault()
                    }
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

            // 🔍 Find the Discord ID from ZLGMembers (if linked)
            // 🔍 Find the Discord ID & Username from ZLGMembers (if linked)
            var zlgMember = _dbContext.ZLGMembers.FirstOrDefault(z => z.UserProfileId == userProfile.Id);
            ulong? discordUserId = zlgMember != null && ulong.TryParse(zlgMember.DiscordId, out ulong parsedDiscordId)
                ? parsedDiscordId
                : null;

            string discordUserName = zlgMember?.DiscordName ?? $"{userProfile.FirstName} {userProfile.LastName}";

            var message = new Message
            {
                MessageGroupId = messageDto.MessageGroupId,
                UserProfileId = userProfile.Id,
                Content = messageDto.Content,
                CreatedAt = DateTime.UtcNow,
                ImgUrl = messageDto.ImgUrl,
                SentToDiscord = false,
                DiscordUserId = discordUserId,
                DiscordUserName = discordUserName // ✅ Store Discord username
            };

            _dbContext.Messages.Add(message);
            _dbContext.SaveChanges();


            return Ok(new
            {
                message.Id,
                message.Content,
                message.CreatedAt,
                message.ImgUrl,
                User = new
                {
                    userProfile.FirstName,
                    userProfile.LastName,
                    DiscordUserId = discordUserId,
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
