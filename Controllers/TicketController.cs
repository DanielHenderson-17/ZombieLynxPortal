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
    public class TicketsController : ControllerBase
    {
        private readonly ZombieLynxPortalAPIDbContext _dbContext;

        public TicketsController(ZombieLynxPortalAPIDbContext context)
        {
            _dbContext = context;
        }

        // ✅ Retrieves all open tickets or tickets assigned to the current user based on role
        [HttpGet("open")]
        [Authorize]
        public IActionResult GetOpenTickets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userProfile = _dbContext.UserProfiles.FirstOrDefault(up => up.UserId.ToString() == userId);

            var ticketsQuery = _dbContext.Tickets
                .Where(t => t.Status == "Open")
                .Select(t => new
                {
                    t.Id,
                    t.Subject,
                    t.Category,
                    t.Game,
                    t.Server,
                    t.Description,
                    t.Status,
                    t.CreatedAt,
                    t.UpdatedAt,
                    AssignedUsers = _dbContext.UserTickets
                        .Where(ut => ut.TicketId == t.Id)
                        .Select(ut => new
                        {
                            ut.UserProfile.FirstName,
                            ut.UserProfile.LastName,
                            ZlgMember = _dbContext.ZLGMembers
                                .Where(z => z.UserProfileId == ut.UserProfile.Id)
                                .Select(z => new
                                {
                                    z.DiscordName,
                                    z.DiscordId,
                                    z.DiscordImgUrl
                                })
                                .FirstOrDefault()
                        })
                        .ToList()
                });

            if (userRole != "Admin" && userProfile != null)
            {
                ticketsQuery = ticketsQuery
                    .Where(t => _dbContext.UserTickets
                        .Any(ut => ut.TicketId == t.Id && ut.UserProfileId == userProfile.Id));
            }

            return Ok(ticketsQuery.ToList());
        }

        // ✅ Retrieves all closed tickets
        [HttpGet("closed")]
        [Authorize]
        public IActionResult GetClosedTickets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userProfile = _dbContext.UserProfiles.FirstOrDefault(up => up.UserId.ToString() == userId);

            var ticketsQuery = _dbContext.Tickets
                .Where(t => t.Status == "Closed")
                .Select(t => new
                {
                    t.Id,
                    t.Subject,
                    t.Category,
                    t.Game,
                    t.Server,
                    t.Description,
                    t.Status,
                    t.CreatedAt,
                    t.UpdatedAt,
                    AssignedUsers = _dbContext.UserTickets
                        .Where(ut => ut.TicketId == t.Id)
                        .Select(ut => new
                        {
                            ut.UserProfile.FirstName,
                            ut.UserProfile.LastName,
                            ZlgMember = _dbContext.ZLGMembers
                                .Where(z => z.UserProfileId == ut.UserProfile.Id)
                                .Select(z => new
                                {
                                    z.DiscordName,
                                    z.DiscordId,
                                    z.DiscordImgUrl
                                })
                                .FirstOrDefault()
                        })
                        .ToList()
                });

            if (userRole != "Admin" && userProfile != null)
            {
                ticketsQuery = ticketsQuery
                    .Where(t => _dbContext.UserTickets
                        .Any(ut => ut.TicketId == t.Id && ut.UserProfileId == userProfile.Id));
            }

            return Ok(ticketsQuery.ToList());
        }

        // ✅ Close a ticket
        [HttpPut("{id}/close")]
        [Authorize]
        public IActionResult CloseTicket(int id)
        {
            var ticket = _dbContext.Tickets.SingleOrDefault(t => t.Id == id);
            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }
            ticket.Status = "Closed";
            ticket.UpdatedAt = DateTime.UtcNow;

            _dbContext.SaveChanges();

            return NoContent();
        }


        // ✅ Restore a ticket
        [HttpPut("{id}/restore")]
        [Authorize]
        public IActionResult RestoreTicket(int id)
        {
            var ticket = _dbContext.Tickets.SingleOrDefault(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }
            if (ticket.Status == "Closed")
            {
                ticket.Status = "Open";
                ticket.UpdatedAt = DateTime.UtcNow;
                _dbContext.SaveChanges();

                return NoContent();
            }

            return BadRequest("Ticket is already open.");
        }

        // ✅ Delete a closed ticket
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteTicket(int id)
        {

            var ticket = _dbContext.Tickets
                .Include(t => t.UserTickets)
                .Include(t => t.AdminTickets)
                .SingleOrDefault(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            if (ticket.Status != "Closed")
            {
                return BadRequest("Only closed tickets can be deleted.");
            }

            if (ticket.UserTickets != null && ticket.UserTickets.Any())
            {
                _dbContext.UserTickets.RemoveRange(ticket.UserTickets);
            }

            if (ticket.AdminTickets != null && ticket.AdminTickets.Any())
            {
                _dbContext.AdminTickets.RemoveRange(ticket.AdminTickets);
            }

            _dbContext.Tickets.Remove(ticket);
            _dbContext.SaveChanges();

            return NoContent();
        }

        // ✅ Get options for ticket form
        [HttpGet("options")]
        [Authorize]
        public IActionResult GetOptions()
        {
            var categories = new[] { "Bug", "Shop Issue", "Connection Issue", "Other" };

            var gamesWithServers = new Dictionary<string, string[]>
    {
        { "Discord Issue", new[]
            {
                "Zombie Lynx Gaming Discord"
            }
        },
        { "Ark:SE", new[]
            {
                "ZombieLynx-TheIsland-3X-PVPClusterORP",
                "ZombieLynx-Extinction-3X-PVPClusterORP",
                "ZombieLynx-Aberration-3X-PVPClusterORP",
                "ZombieLynx-Gen2-3X-PVPClusterORP",
                "ZombieLynx-Fjordur-3X-PVPClusterORP",
                "ZombieLynx-CrystalIsles-3X-PVPClusterORP",
                "ZombieLynx-ScorchedEarth-3X-PVPClusterORP",
                "ZombieLynx-LostIsland-3X-PVPClusterORP",
                "ZombieLynx-Gen1-3X-PVPClusterORP",
                "ZombieLynx-ThCenter-3X-PVPClusterORP",
                "ZombieLynx-Ragnarok-3X-PVPClusterORP",
                "ZombieLynx-Valguero-3X-PVPClusterORP"
            }
        },
        { "Ark:SA", new[]
            {
                "ZombieLynx-TheIsland-3X-PVP",
                "ZombieLynx-ScorchedEarth-3X-PVPORP",
                "ZombieLynx-TheCenter-3X-PVP",
                "ZombieLynx-Aberration-3X-PVPORP"
            }
        },
        { "Eco", new[] { "Zombie Lynx Gaming | Medium Collab | Beginner Friendly" } },
        { "Minecraft", new[] { "Zombie Lynx Gaming Minecraft" } },
        { "Empyrion", new[] { "Zombie Lynx Reforged Eden PVP" } },
        { "Palworld", new[] { "Zombie Lynx Gaming Palworld 3X" } }
    };

            return Ok(new { categories, gamesWithServers });
        }


        // ✅ Get all users (Accessible by all authenticated users)
        [HttpGet("users")]
        [Authorize]
        public IActionResult GetUsers()
        {
            var users = _dbContext.UserProfiles
                .Include(up => up.User)
                .Select(up => new
                {
                    up.Id,
                    up.FirstName,
                    up.LastName,
                    up.User.Email,
                    up.User.Role
                })
                .ToList();

            return Ok(users);
        }



        // ✅ Create a ticket
        [HttpPost]
        [Authorize]
        public IActionResult CreateTicket([FromBody] CreateTicketDTO createTicketDto)
        {
            if (createTicketDto == null)
            {
                return BadRequest("Invalid ticket data.");
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userProfile = _dbContext.UserProfiles.FirstOrDefault(up => up.UserId.ToString() == userId);
            var zlgMember = _dbContext.ZLGMembers.FirstOrDefault(z => z.UserProfileId == userProfile.Id);


            if (userProfile == null)
            {
                return BadRequest("User profile not found.");
            }

            var ticket = new Ticket
            {
                Subject = createTicketDto.Subject,
                Category = createTicketDto.Category,
                Game = createTicketDto.Game,
                Server = createTicketDto.Server,
                Description = createTicketDto.Description,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserProfileId = userProfile.Id,
                DiscordUserId = ulong.TryParse(zlgMember?.DiscordId, out var parsedId) ? parsedId : 0,
            };

            using var transaction = _dbContext.Database.BeginTransaction();
            try
            {
                _dbContext.Tickets.Add(ticket);
                _dbContext.SaveChanges();

                bool isAlreadyAssigned = _dbContext.UserTickets
                    .Any(ut => ut.TicketId == ticket.Id && ut.UserProfileId == userProfile.Id);

                if (!isAlreadyAssigned)
                {
                    _dbContext.UserTickets.Add(new UserTicket
                    {
                        TicketId = ticket.Id,
                        UserProfileId = userProfile.Id,
                        AssignedAt = DateTime.UtcNow
                    });
                    _dbContext.SaveChanges();
                }
                if (createTicketDto.AssignedUserIds != null && createTicketDto.AssignedUserIds.Any())
                {
                    foreach (var assignedUserId in createTicketDto.AssignedUserIds)
                    {
                        var assignedUserExists = _dbContext.UserProfiles.Any(up => up.Id == assignedUserId);
                        var alreadyAssigned = _dbContext.UserTickets.Any(ut => ut.TicketId == ticket.Id && ut.UserProfileId == assignedUserId);

                        if (assignedUserExists && !alreadyAssigned)
                        {
                            _dbContext.UserTickets.Add(new UserTicket
                            {
                                TicketId = ticket.Id,
                                UserProfileId = assignedUserId,
                                AssignedAt = DateTime.UtcNow
                            });
                        }
                    }

                    _dbContext.SaveChanges();
                }

                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(500, $"Error creating ticket: {ex.Message}");
            }

            return CreatedAtAction(nameof(CreateTicket), new { id = ticket.Id }, new
            {
                ticket.Id,
                ticket.Subject,
                ticket.Category,
                ticket.Game,
                ticket.Server,
                ticket.Description,
                ticket.Status,
                ticket.CreatedAt,
                ticket.UpdatedAt
            });
        }
        // ✅ Get a ticket by ID
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetTicketById(int id)
        {
            var ticket = _dbContext.Tickets
                .Include(t => t.UserTickets)
                    .ThenInclude(ut => ut.UserProfile)
                        .ThenInclude(up => up.User)
                .Include(t => t.AdminTickets)
                    .ThenInclude(at => at.Admin)
                        .ThenInclude(up => up.User)
                .FirstOrDefault(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            var ticketDetails = new
            {
                ticket.Id,
                ticket.Subject,
                ticket.Category,
                ticket.Game,
                ticket.Server,
                ticket.Description,
                ticket.Status,
                ticket.CreatedAt,
                ticket.UpdatedAt,
                AssignedUsers = ticket.UserTickets.Select(ut => new
                {
                    ut.UserProfile.Id,
                    ut.UserProfile.FirstName,
                    ut.UserProfile.LastName,
                    ZlgMember = _dbContext.ZLGMembers
                        .Where(z => z.UserProfileId == ut.UserProfile.Id)
                        .Select(z => new
                        {
                            z.DiscordName,
                            z.DiscordId,
                            z.DiscordImgUrl
                        })
                        .FirstOrDefault()
                }).ToList(),

                AssignedAdmins = ticket.AdminTickets.Select(at => new
                {
                    at.Admin.User.Id,
                    at.Admin.FirstName,
                    at.Admin.LastName
                }).ToList()
            };

            return Ok(ticketDetails);
        }

        // ✅ Assign user to ticket
        [HttpPost("{id}/assign-user")]
        [Authorize(Roles = "Admin")]
        public IActionResult AssignUserToTicket(int id, [FromBody] int userId)
        {

            var ticket = _dbContext.Tickets.Find(id);
            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            var userProfile = _dbContext.UserProfiles.Find(userId);
            if (userProfile == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            bool alreadyAssigned = _dbContext.UserTickets
                .Any(ut => ut.TicketId == id && ut.UserProfileId == userId);

            if (alreadyAssigned)
            {
                return BadRequest("User is already assigned to this ticket.");
            }


            var userTicket = new UserTicket
            {
                TicketId = id,
                UserProfileId = userId,
                AssignedAt = DateTime.UtcNow
            };

            _dbContext.UserTickets.Add(userTicket);
            _dbContext.SaveChanges();

            return Ok($"User with ID {userId} has been assigned to ticket ID {id}.");
        }

        // ✅ Edit a Ticket by ID
        [HttpPut("{id}/edit")]
        [Authorize]
        public IActionResult EditTicket(int id, [FromBody] EditTicketDTO editTicketDto)
        {
            if (editTicketDto == null)
            {
                return BadRequest("Invalid ticket data.");
            }

            var ticket = _dbContext.Tickets.SingleOrDefault(t => t.Id == id);
            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            ticket.Subject = editTicketDto.Subject ?? ticket.Subject;
            ticket.Category = editTicketDto.Category ?? ticket.Category;
            ticket.Game = editTicketDto.Game ?? ticket.Game;
            ticket.Server = editTicketDto.Server ?? ticket.Server;
            ticket.Description = editTicketDto.Description ?? ticket.Description;
            ticket.UpdatedAt = DateTime.UtcNow;

            _dbContext.SaveChanges();

            return Ok(new
            {
                ticket.Id,
                ticket.Subject,
                ticket.Category,
                ticket.Game,
                ticket.Server,
                ticket.Description,
                ticket.Status,
                ticket.CreatedAt,
                ticket.UpdatedAt
            });
        }
    }
}
