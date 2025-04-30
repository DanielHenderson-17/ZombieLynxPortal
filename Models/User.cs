using System.ComponentModel.DataAnnotations;
using ZombieLynxPortalAPI.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, EmailAddress]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required, MaxLength(50)]
    public string Role { get; set; } = "User";

    public UserProfile Profile { get; set; }
    public bool Verified { get; set; } = false;

}
